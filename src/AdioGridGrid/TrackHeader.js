import React from 'react';

export default class TrackHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      heightDelta: 0,
      isResizing: false,
    };

    this.yPosition = null;
  }

  onHandleMouseDown = (e) => {
    this.yPosition = e.clientY;

    this.setState(() => ({
      isResizing: true,
    }));

    window.addEventListener('mousemove', this.onHandleDrag);
    window.addEventListener('mouseup', this.onHandleMouseUp);
  };

  onHandleMouseUp = () => {
    this.yPosition = null;

    this.props.onResize(this.props.height + this.state.heightDelta);

    this.setState(() => ({
      heightDelta: 0,
      isResizing: false,
    }));

    window.removeEventListener('mousemove', this.onHandleDrag);
    window.removeEventListener('mouseup', this.onHandleMouseUp);
  };

  onHandleDrag = (e) => {
    const newYPosition = e.clientY;

    this.setState(() => ({
      heightDelta: newYPosition - this.yPosition,
    }));
  };

  render() {
    const { children, height } = this.props;
    const { isResizing, heightDelta } = this.state;

    const handleStyle = isResizing
      ? {
          transform: `translate3d(0, ${heightDelta}px, 0)`,
          zIndex: 1000,
        }
      : {};

    return (
      <div style={{ height }} className="TrackHeader">
        {children}

        <div
          style={handleStyle}
          onMouseDown={this.onHandleMouseDown}
          className="Handle"
        />
      </div>
    );
  }
}
