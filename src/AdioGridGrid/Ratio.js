export const pxToMs = (ratio, px) => {
  return (px / ratio) * 1000;
};

export const msToPx = (ratio, ms) => (ms / 1000) * ratio;

export const clipWidth = (clip, ratio) =>
  msToPx(ratio, clip.endTimeMs - clip.startTimeMs);

export const clipsToRender = (clips, start, stop) => {
  return clips.filter((clip) => {
    // if (clip.endTimeMs > start) return true;
    // if (clip.startTimeMs < stop) return true;
    return clip.startTimeMs < stop && clip.endTimeMs > start;
  });
};

export const beatsPerSecond = (bpm) => bpm / 60;
export const secondsPerBeat = (bpm) => 1 / beatsPerSecond(bpm);

const beatNumbers = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
  SIX: 6,
  SEVEN: 7,
  EIGHT: 8,
};

export const beatsPerBar = (timeSignature) =>
  beatNumbers[timeSignature.split('_')[0]];

export const pxPerBeat = (bpm, timeSignature, zoom) => {
  const msPerBeat = secondsPerBeat(bpm) * 1000;

  return msToPx(zoom, msPerBeat);
};

export const pxPerBar = (bpm, timeSignature, zoom) => {
  return pxPerBeat(bpm, timeSignature, zoom) * beatsPerBar(timeSignature);
};
