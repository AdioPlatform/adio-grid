import React from 'react';
import './AdioGrid.css';

export default class TracksContainer extends React.Component {
  trackStyles() {
    const { scrollY } = this.props;

    return {
      transform: `translate3d(0, ${-scrollY}px, 0)`,
    };
  }

  render() {
    return (
      <div className="TracksContainer">
        <div style={this.trackStyles()}>{this.props.children}</div>
      </div>
    );
  }
}
