import React from 'react';

export default class TrackHeaders extends React.Component {
  render() {
    return (
      <div className="TrackHeaders no-overflow">
        <div className="TrackHeadersContainer" style={this.props.style}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
