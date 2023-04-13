import Workout from './Workout';

class Cycling extends Workout {
  elevation: number;
  speed: number;
  type: 'cycling' = 'cycling';

  constructor(coords: [number, number], distance: number, duration: number, elevation: number) {
    super(coords, distance, duration);
    this.elevation = elevation;
    this.calcSpeed();
    this.setDescription();
  }

  private calcSpeed(): number {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

export default Cycling;
