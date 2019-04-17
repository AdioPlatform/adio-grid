import React from 'react';
// import './AdioGrid.css';
import * as Ratio from './Ratio';

export default class Clip extends React.Component {
  clipStyles() {
    const { scrollX, width, zoom, clip, isScrolling } = this.props;

    const xPos = Ratio.msToPx(zoom, clip.startTimeMs);

    const length = clip.endTimeMs - clip.startTimeMs;

    return {
      transform: `translate3d(${xPos}px, 0, 0)`,
      // left: xPos,
      position: 'absolute',
      height: this.props.trackHeight,
      width: Ratio.clipWidth(clip, zoom),
    };
  }

  render() {
    return <div className="Clip" style={this.clipStyles()} />;
  }
}
