import React from 'react';
import Clip from './Clip';
import * as Ratio from './Ratio';

export default class Track extends React.Component {
  render() {
    const {
      style,
      track,
      maxVisibleMs,
      minVisibleMs,
      renderClips,
      ...restProps
    } = this.props;

    const clips = Ratio.clipsToRender(track.clips, minVisibleMs, maxVisibleMs);

    return (
      <div className="Track" style={style}>
        {renderClips &&
          clips.map((clip) => {
            return <Clip {...restProps} key={clip.id} clip={clip} />;
          })}
      </div>
    );
  }
}
