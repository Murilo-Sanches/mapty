const HTMLFactory = <T>(selector: string): T => {
  return document.querySelector(selector)! as T;
};

const $form = HTMLFactory<HTMLFormElement>('.form');
const $containerWorkouts = HTMLFactory<HTMLUListElement>('.workouts');
const $inputType = HTMLFactory<HTMLSelectElement>('.form__input--type');
const $inputDistance = HTMLFactory<HTMLInputElement>('.form__input--distance');
const $inputDuration = HTMLFactory<HTMLInputElement>('.form__input--duration');
const $inputCadence = HTMLFactory<HTMLInputElement>('.form__input--cadence');
const $inputElevation = HTMLFactory<HTMLInputElement>('.form__input--elevation');

export {
  $form,
  $containerWorkouts,
  $inputType,
  $inputDistance,
  $inputDuration,
  $inputCadence,
  $inputElevation,
};
