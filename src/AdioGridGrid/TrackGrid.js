import * as Ratio from './Ratio';

export const GRID_TYPES = {
  BARS_BEATS: 'BARS_BEATS',
  SECONDS: 'SECONDS',
};

export const gridColor = (alpha) => `rgba(234, 240, 242, ${alpha})`;
// export const gridColor = (alpha) => `rgb(234, 240, 242)`;

// background-image: repeating-linear-gradient(
//   to right,
//   black,
//   black 3px,
//   transparent 0,
//   transparent 100px
// ), repeating-linear-gradient(
//   to right,
//   blue,
//   blue 2px,
//   transparent 0,
//   transparent 50px
// ), repeating-linear-gradient(
//   to right,
//   red,
//   red 1px,
//   transparent 0,
//   transparent 10px
// );

// background-repeat: no-repeat;
// background-position: bottom;
// background-size: 100% 75%, 100% 50%, 100% 25%;

export const generateTrackGrid = ({ type, zoom, bpm, timeSignature }) => {
  let allWidth;
  let denomCount;
  let columnWidth;

  switch (type) {
    case GRID_TYPES.BARS_BEATS:
      denomCount = Ratio.beatsPerBar(timeSignature);
      // allWidth = Ratio.pxPerBar(bpm, timeSignature, zoom);
      columnWidth = Ratio.pxPerBeat(bpm, timeSignature, zoom);
      // allWidth = Ratio.pxPerBar(bpm, timeSignature, zoom);
      allWidth = columnWidth * denomCount;

      break;

    case GRID_TYPES.SECONDS:
      allWidth = zoom;
      denomCount = 4;
      columnWidth = allWidth / denomCount;

      break;
  }

  // const columnWidth = allWidth / denomCount;

  const bigLine = `
    repeating-linear-gradient(
      to right,
      ${gridColor(1)},
      ${gridColor(1)} 2px,
      transparent 0,
      transparent ${allWidth}px
    )
   `;

  const lines = [bigLine];

  for (let i = 0; i < denomCount; i++) {
    const line = `
      repeating-linear-gradient(
        to right,
        ${gridColor(0.75)},
        ${gridColor(0.75)} 1px,
        transparent 0,
        transparent ${columnWidth}px
      )
     `;

    lines.push(line);
  }

  return lines.join(', ');
};
