import L from 'leaflet';

import {
  $form,
  $inputDistance,
  $inputCadence,
  $inputDuration,
  $inputElevation,
  $inputType,
  $containerWorkouts,
} from './dom';
import Workout from './Workout';
import Cycling from './Cycling';
import Running from './Running';

class App {
  private map: L.Map;
  private mapEvent: L.LeafletMouseEvent;
  // private workouts: Cycling[] | Running[] = [];
  private workouts: (Cycling | Running)[] = [];
  mapZoomLevel: number = 13;

  constructor() {
    this.getPosition();

    this.getLocalStorage();

    // * newWorkout usa o this para acessar o map. Sem o bind, o this vai ser referente ao $form, para corrigir
    // * basta usar o bind() e apontar para a própria classe - bind(this), assim dentro do newWorkout o this vai
    // * conseguir usar as propriedades da classe
    $form.addEventListener('submit', this.newWorkout.bind(this));

    // + como toggleElevationField não usa o this, não precisa fazer o bind
    $inputType.addEventListener('change', this.toggleElevationField);

    $containerWorkouts.addEventListener('click', this.moveTo.bind(this));
  }

  private getPosition(): void {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        // + (p) => this.loadMap(p),
        this.loadMap.bind(this),
        () => {
          alert('Não consegui descobrir sua localização :(');
        }
      );
  }

  private loadMap(position: GeolocationPosition): void {
    const { latitude, longitude } = position.coords;
    const coords: [number, number] = [latitude, longitude];

    this.map = L.map('map').setView(coords, this.mapZoomLevel);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.map.on('click', this.showForm.bind(this));

    this.workouts.forEach((workout) => this.renderWorkoutPopup(workout));
  }

  private showForm(mapEvent: L.LeafletMouseEvent): void {
    this.mapEvent = mapEvent;
    $form.classList.remove('hidden');
    $inputDistance.focus();
  }

  private hideForm(): void {
    $inputDistance.value = $inputCadence.value = $inputDuration.value = $inputElevation.value = '';
    $form.style.display = 'none';
    $form.classList.add('hidden');
    setTimeout(() => ($form.style.display = 'grid'), 1000);
  }

  private toggleElevationField(): void {
    $inputElevation.closest('.form__row')?.classList.toggle('form__row--hidden');
    $inputCadence.closest('.form__row')?.classList.toggle('form__row--hidden');
  }

  private newWorkout(e: SubmitEvent): void {
    e.preventDefault();

    const validInputs = (...inputs: number[]): boolean =>
      inputs.every((val) => Number.isFinite(val) && val > 0);

    const type = $inputType.value as 'running' | 'cycling';
    const distance = +$inputDistance.value;
    const duration = +$inputDuration.value;

    let cadence: number = 0;
    let workout!: Cycling | Running;

    const { lat, lng } = this.mapEvent.latlng;

    if (type === 'running') {
      cadence = +$inputCadence.value;

      if (!validInputs(distance, duration, cadence)) {
        return alert(
          'Coloque apenas números maiores do que 0 para conseguirmos criar o seu treino'
        );
      }

      workout = new Running([lat, lng], distance, duration, cadence);
    }
    if (type === 'cycling') {
      const elevation = +$inputElevation.value;

      if (!validInputs(distance, duration)) {
        return alert(
          'Coloque apenas números maiores do que 0 para conseguirmos criar o seu treino'
        );
      }

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    this.workouts.push(workout);

    this.renderWorkoutPopup(workout);
    this.renderWorkout(workout);

    this.hideForm();
    this.setLocalStorage();
  }

  private renderWorkoutPopup(workout: Workout) {
    L.marker(workout.coords)
      .addTo(this.map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(`${workout.type === 'running' ? '🏃‍♂️' : '🚴'} ${workout.description}`)
      .openPopup();
  }

  private renderWorkout(workout: Running | Cycling): void {
    let html = `
          <li class="workout workout--${workout.type}" data-id="${workout.id}">
            <h2 class="workout__title">${workout.description}</h2>
            <div class="workout__details">
              <span class="workout__icon">${workout.type === 'running' ? '🏃‍♂️' : '🚴'}</span>
              <span class="workout__value">${workout.distance}</span>
              <span class="workout__unit">km</span>
            </div>
            <div class="workout__details">
              <span class="workout__icon">⏱</span>
              <span class="workout__value">${workout.duration}</span>
              <span class="workout__unit">min</span>
            </div>
    `;

    if (workout.type === 'running')
      html += `
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>
      `;

    if (workout.type === 'cycling')
      html += `
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevation}</span>
            <span class="workout__unit">m</span>
          </div>
        </li>
    `;

    $form.insertAdjacentHTML('afterend', html);
  }

  private moveTo(e: MouseEvent): void {
    const workoutEl = (e.target as HTMLElement).closest('.workout') as HTMLDivElement;

    if (!workoutEl) return;

    const workout = this.workouts.find((work) => work.id === workoutEl.dataset.id);

    this.map.setView(workout!.coords, this.mapZoomLevel, { animate: true, duration: 1 });
  }

  // ! quando JSON.stringify() é usado os objetos perdem o prototype chain
  private setLocalStorage(): void {
    // + a solução seria fazer o loop para cada chunck de informação e criar um objeto a partir disso
    localStorage.setItem('workouts', JSON.stringify(this.workouts));
  }

  private getLocalStorage(): void {
    const raw = localStorage.getItem('workouts');

    if (!raw) return;

    const data = JSON.parse(raw);

    this.workouts = data;
    this.workouts.forEach((workout) => this.renderWorkout(workout));
  }

  reset() {
    localStorage.removeItem('workouts');
    location.reload();
  }
}

new App();
