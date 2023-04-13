import {
  $form,
  $inputDistance,
  $inputCadence,
  $inputDuration,
  $inputElevation,
  $inputType,
} from './dom';

const displayForm = (
  coords: [number, number],
  map: L.Map,
  displayMapPopup: (coords: [number, number], map: L.Map, body: string) => void
): void => {
  $inputDistance.value = $inputCadence.value = $inputDuration.value = $inputElevation.value = '';

  $form.classList.toggle('hidden');
  $inputDistance.focus();

  $form.addEventListener('submit', (e: SubmitEvent) => {
    e.preventDefault();
    displayMapPopup(coords, map, 'DO FORMULARIo');
  });

  $inputType.addEventListener('change', () => {
    $inputElevation.closest('.form__row')?.classList.toggle('form__row--hidden');
    $inputCadence.closest('.form__row')?.classList.toggle('form__row--hidden');
  });
};

class Form {
  constructor() {
    $inputDistance.value = $inputCadence.value = $inputDuration.value = $inputElevation.value = '';

    $form.classList.toggle('hidden');
    $inputDistance.focus();

    $form.addEventListener('submit', (e: SubmitEvent) => {
      e.preventDefault();
    });

    $inputType.addEventListener('change', () => {
      $inputElevation.closest('.form__row')?.classList.toggle('form__row--hidden');
      $inputCadence.closest('.form__row')?.classList.toggle('form__row--hidden');
    });
  }
}

export default Form;
