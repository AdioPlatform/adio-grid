import React, { Component } from 'react';
import './App.css';
// import AdioGrid from './AdioGrid';
// import Track from './AdioGrid/Track';
// import GridHeader from './AdioGrid/GridHeader';
// import TracksContainer from './AdioGrid/TracksContainer';
import Parent from './AdioGridGrid/Parent';
import { getTracks } from './AdioGridGrid/data';
import tracks from './AdioGridGrid/gqldata';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Parent tracks={tracks} />
      </div>
    );
  }
}

export default App;
