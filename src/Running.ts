import Workout from './Workout';

class Running extends Workout {
  cadence: number;
  pace: number;
  type: 'running' = 'running';

  constructor(coords: [number, number], distance: number, duration: number, cadence: number) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this.setDescription();
  }

  private calcPace(): number {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

export default Running;
