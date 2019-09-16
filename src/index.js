import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Game from './game';

class App extends Component {
    componentDidMount(){  
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext("2d");

        document.body.style.margin = 0;
        document.body.style.overflow = 'hidden';

        setInterval(
            Game.loop({ ctx, width: canvas.width, height: canvas.height }), 
        1000/Game.FPS);
    }

    render(){
      return (
        <canvas ref="canvas" width={window.innerWidth} height={window.innerHeight} />
      );
    }
  }

ReactDOM.render(<App />, document.getElementById('root'));