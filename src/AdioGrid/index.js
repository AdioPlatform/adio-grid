import React from 'react';
import './AdioGrid.css';
import * as Ratio from './Ratio';
import PlayHead from './PlayHead';

export default class AdioGrid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      scrollX: 0,
      scrollY: 0,
      width: null,
      height: null,
      zoom: 50,
      playheadPosition: 0,
    };

    this.containerRef = React.createRef();

    this.scheduleAnimationFrame = false;
  }

  componentWillMount() {
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  componentDidMount() {
    this.updateDimensions();
  }

  setPlayHeadPosition = (playheadPosition) => {
    this.setState(() => ({
      playheadPosition,
    }));
  };

  innerTrackStyles() {
    const { scrollX, width: gridWidth, zoom } = this.state;

    const width = gridWidth * 2;

    return {
      width,
      transform: `translate3d(${-scrollX}px, 0, 0)`,
      backgroundImage: `
        repeating-linear-gradient(
          to right,
          rgb(234, 240, 242),
          transparent 3px,
          transparent ${zoom}px
        )
      `,
    };
  }

  updateDimensions = () => {
    const width = this.containerRef.current.offsetWidth;
    const height = this.containerRef.current.offsetHeight;

    this.setState(
      () => ({
        width,
        height,
      }),
      () => (this.scheduleAnimationFrame = false),
    );
  };

  updateScroll = (deltaX, deltaY) => {
    this.setState(
      (state) => ({
        scrollX: Math.max(0, state.scrollX + deltaX),
        scrollY: Math.max(0, state.scrollY + deltaY),
      }),
      () => (this.scheduleAnimationFrame = false),
    );
  };

  updateZoom = (delta) => {
    this.setState(
      (state) => ({
        zoom: Math.max(state.zoom + delta, 10),
      }),
      () => (this.scheduleAnimationFrame = false),
    );
  };

  wheelie = (e) => {
    e.preventDefault();

    if (this.scheduleAnimationFrame) return;

    const { deltaY, deltaX } = e;

    this.scheduleAnimationFrame = true;

    let updateFn = e.metaKey
      ? () => this.updateZoom(deltaY)
      : () => this.updateScroll(deltaX, deltaY);

    window.requestAnimationFrame(updateFn);
  };

  resize = () => {
    if (this.scheduleAnimationFrame) return;

    this.scheduleAnimationFrame = true;

    window.requestAnimationFrame(this.updateDimensions);
  };

  playheadStyles() {
    const { playheadPosition } = this.state;

    return {
      transform: `translate3d(${playheadPosition - 200}px, 0, 0)`,
    };
  }

  renderProps() {
    return {
      ...this.state,
      setPlayHeadPosition: this.setPlayHeadPosition,
      startMs: Ratio.pxToMs(this.state.zoom, this.state.scrollX),
      innerTrackStyles: this.innerTrackStyles(),
      playHeadStyles: this.playheadStyles(),
      endMs: Ratio.pxToMs(
        this.state.zoom,
        this.state.scrollX + this.state.width - 200,
      ),
    };
  }

  render() {
    const renderProps = this.renderProps();

    return (
      <div onWheel={this.wheelie} className="AdioGrid" ref={this.containerRef}>
        {this.props.children(renderProps)}
      </div>
    );
  }
}
