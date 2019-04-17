import React from 'react';
import './AdioGrid.css';
import * as Ratio from './Ratio';

export default class Clip extends React.Component {
  clipStyles() {
    const { scrollX, width, zoom } = this.props;

    const xPos = Ratio.msToPx(zoom, 1000);

    return {
      transform: `translate3d(${xPos}px, 0, 0)`,
      width: Ratio.msToPx(zoom, 1000),
    };
  }

  render() {
    return <div className="Clip" style={this.clipStyles()} />;
  }
}
