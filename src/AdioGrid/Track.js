import React from 'react';
import './AdioGrid.css';
import PlayHead from './PlayHead';
import Clip from './Clip';

export default class Track extends React.Component {
  onMouseDown = (e) => {
    this.props.setPlayHeadPosition(e.clientX);
  };

  render() {
    return (
      <div className="Track">
        <div className="TrackHeader">Track Header</div>

        <div
          className="TrackTrack"
          style={this.props.innerTrackStyles}
          onMouseDown={this.onMouseDown}
        >
          <PlayHead style={this.props.playHeadStyles} />
          <Clip scrollX={this.props.scrollX} zoom={this.props.zoom} />
        </div>
      </div>
    );
  }
}
