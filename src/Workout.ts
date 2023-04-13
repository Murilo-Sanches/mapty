abstract class Workout {
  coords: [number, number];
  distance: number;
  duration: number;
  date: Date = new Date();
  id: string = (Date.now() + '').slice(-10);
  type: 'running' | 'cycling';
  description: string;

  constructor(coords: [number, number], distance: number, duration: number) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }

  protected setDescription(): void {
    // prettier-ignore
    const months: string[] = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                            'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} data: ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
}

export default Workout;
