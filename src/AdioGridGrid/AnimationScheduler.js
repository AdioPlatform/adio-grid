export default class AnimationScheduler {
  constructor() {
    this.scheduled = false;
  }

  schedule(fn) {
    if (this.scheduled) return;

    this.scheduled = true;

    window.requestAnimationFrame(fn);
  }

  unschedule = () => (this.scheduled = false);
}
