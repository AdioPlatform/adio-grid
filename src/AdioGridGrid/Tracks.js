import React from 'react';

export default class Tracks extends React.Component {
  render() {
    const { innerRef, onClick, children, style, ...restProps } = this.props;

    return (
      <div
        className="Tracks no-overflow"
        ref={innerRef}
        onMouseDown={onClick}
        {...restProps}
      >
        <div className="TracksContainer" style={style}>
          {children}
        </div>
      </div>
    );
  }
}
