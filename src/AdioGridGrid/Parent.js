import React from 'react';
import './Gridly.css';
import TrackHeaders from './TrackHeaders';
import TrackHeader from './TrackHeader';
import Tracks from './Tracks';
import Track from './Track';
import AnimationScheduler from './AnimationScheduler';
import * as Ratio from './Ratio';
import { generateTrackGrid, GRID_TYPES } from './TrackGrid';
import Playhead from './Playhead';

const min0 = (n) => Math.max(n, 0);

export default class Parent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playing: null,
      scrollX: 0,
      scrollY: 0,
      width: 0,
      height: 0,
      tracksWidth: 0,
      tracksHeight: 0,
      zoom: 50,
      playheadPosition: 1000,
      trackHeight: 100,
      isScrolling: false,
      gridType: GRID_TYPES.BARS_BEATS,
    };

    this.parent = React.createRef();
    this.tracks = React.createRef();

    this.animationScheduler = new AnimationScheduler();

    window.addEventListener('resize', this.resize);
    window.addEventListener('keydown', this.onKeyDown);
  }

  totalTrackHeight() {
    return this.props.tracks.length * this.state.trackHeight;
  }

  maxScroll() {
    return Math.max(this.totalTrackHeight() - (this.state.height - 75), 0);
  }

  trackHeaderStyles() {
    return {
      transform: `translate3d(0, ${-this.state.scrollY}px, 0)`,
    };
  }

  tracksToRender() {
    const { tracksHeight, trackHeight, scrollY } = this.state;

    const startIndex = Math.ceil(Math.max(scrollY, 1) / trackHeight) - 1;

    const lastIndex = Math.ceil(tracksHeight / trackHeight) + startIndex;

    return { startIndex, lastIndex };
  }

  trackStyles() {
    const { scrollX, tracksWidth: pageWidth, zoom, trackHeight } = this.state;
    const page = pageWidth ? Math.ceil(scrollX / pageWidth) : 0;
    const additionalPageWidth = page * pageWidth;
    const width = pageWidth + additionalPageWidth;

    return {
      transform: `translate3d(${-this.state.scrollX}px, ${-this.state
        .scrollY}px, 0)`,
      width,
    };
  }

  innerTrackStyles() {
    const { zoom, trackHeight } = this.state;

    const backgroundImage = generateTrackGrid({
      type: this.state.gridType,
      zoom: zoom,
      timeSignature: 'FOUR_FOUR',
      bpm: 120,
    });

    return {
      height: trackHeight,
      backgroundImage,
    };
  }

  componentDidMount() {
    this.updateDimensions();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = (e) => {
    switch (e.key) {
      case 'Enter':
        this.setState(() => ({
          scrollX: 0,
          playheadPosition: 0,
        }));

        return;

      case ' ':
        this.togglePlaying();

        return;
    }
  };

  togglePlaying = () => {
    if (this.state.playing) {
      clearInterval(this.playingInterval);
      this.playingInterval = null;
      this.setState(() => ({
        playing: null,
      }));

      return;
    }

    this.setState(
      () => ({
        playing: Date.now(),
      }),
      () => this.startPlayingLoop(),
    );
  };

  startPlayingLoop = () => {
    if (!this.state.playing) return;

    // if (this.state.playheadPosition % 1000 < 10) {
    //   const x = new Date();
    //   console.log(
    //     this.state.playheadPosition,
    //     x.getSeconds(),
    //     x.getMilliseconds(),
    //   );
    // }

    this.setState(
      (state) => {
        const now = Date.now();

        return {
          playheadPosition: state.playheadPosition + now - state.playing,
          playing: now,
        };
      },
      () => {
        window.requestAnimationFrame(this.startPlayingLoop);
      },
    );
  };

  resize = () => {
    this.animationScheduler.schedule(this.updateDimensions);
  };

  onWheel = (e) => {
    e.preventDefault();

    const { deltaY, deltaX } = e;

    const updateFn = e.metaKey
      ? () => this.updateZoom(deltaY)
      : () => this.updateScroll(deltaX, deltaY);

    this.animationScheduler.schedule(updateFn);
  };

  updateDimensions = () => {
    const width = this.parent.current.offsetWidth;
    const height = this.parent.current.offsetHeight;
    const tracksWidth = this.tracks.current.offsetWidth;
    const tracksHeight = this.tracks.current.offsetHeight;

    this.setState(
      () => ({
        width,
        height,
        tracksWidth,
        tracksHeight,
      }),
      this.animationScheduler.unschedule,
    );
  };

  updateScroll(deltaX, deltaY) {
    this.setState(
      (state) => ({
        scrollX: min0(state.scrollX + deltaX),
        scrollY: Math.min(min0(state.scrollY + deltaY), this.maxScroll()),
        isScrolling: true,
      }),
      () => {
        this.animationScheduler.unschedule();
        this.stopScrolling();
      },
    );
  }

  stopScrolling() {
    if (this.isScrollingTimeout) {
      clearTimeout(this.isScrollingTimeout);
      this.isScrollingTimeout = null;
    }

    this.isScrollingTimeout = setTimeout(() => {
      this.setState(() => ({
        isScrolling: false,
      }));
    }, 100);
  }

  playheadBasedPositionStuff() {
    const { scrollX, zoom, playheadPosition } = this.state;

    const playheadPositionPx = Ratio.msToPx(zoom, playheadPosition);
    const otherPlayheadPosition = Ratio.msToPx(200, playheadPosition);
    const playheadDistanceFromStart = playheadPositionPx - scrollX;

    // console.log(playheadDistanceFromStart);
  }

  updateZoom = (delta) => {
    this.setState((state) => {
      const { scrollX, zoom, playheadPosition } = state;
      const newZoom = Math.max(state.zoom + delta, 10);

      const playheadPositionPx = Ratio.msToPx(zoom, playheadPosition);
      const newPlayheadPositionPx = Ratio.msToPx(newZoom, playheadPosition);
      const playheadPostitionDelta = playheadPositionPx - newPlayheadPositionPx;

      return {
        zoom: newZoom,
        scrollX: Math.max(scrollX - playheadPostitionDelta, 0),
      };
    }, this.animationScheduler.unschedule);
  };

  getTracksTimeLimits() {
    return {
      startMs: Ratio.pxToMs(this.state.zoom, this.state.scrollX),
      endMs: Ratio.pxToMs(
        this.state.zoom,
        this.state.scrollX + this.state.tracksWidth,
      ),
    };
  }

  trackProps() {
    return {
      ...this.state,
      style: this.innerTrackStyles(),

      minVisibleMs: Ratio.pxToMs(this.state.zoom, this.state.scrollX),
      maxVisibleMs: Ratio.pxToMs(
        this.state.zoom,
        this.state.scrollX + this.state.tracksWidth,
      ),
    };
  }

  updatePlayheadPostion = (playheadPosition) => {
    this.setState(
      () => ({
        playheadPosition,
      }),
      this.animationScheduler.unschedule,
    );
  };

  getPlayheadPositionMs(playheadPositionPx, zoom = this.state.zoom) {
    return Ratio.pxToMs(zoom, playheadPositionPx);
  }

  getPlayheadPositionFromMouseEvent = (e) => {
    const tracksOffset = this.state.width - this.state.tracksWidth;
    const playheadOffsetInTracks = e.pageX - tracksOffset + this.state.scrollX;

    return this.getPlayheadPositionMs(playheadOffsetInTracks);
  };

  onTracksContainerClick = (e) => {
    const playheadPosition = this.getPlayheadPositionFromMouseEvent(e);

    this.animationScheduler.schedule(() =>
      this.updatePlayheadPostion(playheadPosition),
    );

    const onMouseMove = (ev) => {
      const mouseMovePlayheadPosition = this.getPlayheadPositionFromMouseEvent(
        ev,
      );

      this.animationScheduler.schedule(() =>
        this.updatePlayheadPostion(mouseMovePlayheadPosition),
      );
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  onTrackResize = (trackHeight) => {
    this.setState(() => ({
      trackHeight,
    }));
  };

  render() {
    const { tracks } = this.props;
    const trackProps = this.trackProps();

    // const { scrollX, scrollY, tracksHeight, tracksWidth } = this.state;

    const tracksToRender = this.tracksToRender();

    this.playheadBasedPositionStuff();

    // const topLeft = { x: scrollX, y: scrollY };
    // const bottomRight = { x: scrollX + tracksWidth, y: scrollY + tracksHeight };

    return (
      <div className="GridContainer" ref={this.parent} onWheel={this.onWheel}>
        <div className="Corner">
          <button
            onClick={() =>
              this.setState(({ gridType }) => ({
                gridType:
                  gridType === GRID_TYPES.BARS_BEATS
                    ? GRID_TYPES.SECONDS
                    : GRID_TYPES.BARS_BEATS,
              }))
            }
          >
            {this.state.gridType}
          </button>
        </div>
        <div className="Timeline" />

        <TrackHeaders style={this.trackHeaderStyles()}>
          {tracks.map((track) => (
            <TrackHeader
              onResize={this.onTrackResize}
              key={track.id}
              height={this.state.trackHeight}
            >
              {track.name}
            </TrackHeader>
          ))}
        </TrackHeaders>

        <Tracks
          style={this.trackStyles()}
          innerRef={this.tracks}
          onClick={this.onTracksContainerClick}
        >
          <Playhead
            scrollY={this.state.scrollY}
            position={Ratio.msToPx(
              this.state.zoom,
              this.state.playheadPosition,
            )}
          />

          {tracks.map((track, i) => (
            <Track
              key={track.id}
              {...trackProps}
              track={track}
              renderClips={
                i >= tracksToRender.startIndex && i <= tracksToRender.lastIndex
              }
            />
          ))}
        </Tracks>
      </div>
    );
  }
}
