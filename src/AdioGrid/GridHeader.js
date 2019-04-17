import React from 'react';
import './AdioGrid.css';

export default class GridHeader extends React.Component {
  timelineStyles() {
    const { scrollX } = this.props;

    return {
      transform: `translate3d(${-scrollX}px, 0, 0)`,
    };
  }

  render() {
    return (
      <div className="GridHeader">
        <div className="TimelineHeader">Top Left</div>
        <div className="Timeline" style={this.timelineStyles()}>
          Timeline
        </div>
      </div>
    );
  }
}
