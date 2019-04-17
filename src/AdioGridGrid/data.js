const rando = (max = 10000) => Math.floor(Math.random() * max);

const clipTimes = () => {
  const startTimeMs = rando();
  const endTimeMs = rando() + startTimeMs;

  return {
    startTimeMs,
    endTimeMs,
  };
};

export const getTracks = () => {
  const trackCount = rando(50);
  // const trackCount = 1;

  const tracks = [];

  for (let i = 1; i <= trackCount; i++) {
    const clip1 = { id: `clip-${i}-1`, ...clipTimes() };
    const clip2Times = clipTimes();

    const clip2 = {
      id: `clip-${i}-2`,
      startTimeMs: clip1.startTimeMs + rando(8000) + clip2Times.startTimeMs,
      endTimeMs: clip1.endTimeMs + rando(8000) + clip2Times.endTimeMs,
    };

    const track = {
      id: `track-${i}`,
      name: `Track ${i}`,
      clips: [clip1, clip2],
    };

    tracks.push(track);
  }

  return tracks;
};
