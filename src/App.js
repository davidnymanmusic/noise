import React, { useState, useEffect, useRef } from 'react';
import Tone from 'tone';
import './App.css';
import { useToggle } from './useToggle';

function App() {
  const [volume, setVolume] = useState(-20);
  const [focus, setFocus] = useState('');

  const [type, setType] = useState({ color: 'white', active: true });
  const [noise, setNoise] = useState(
    new Tone.Noise({
      type,
      volume: -20,
    }),
  );

  const ref = useRef(null);
  const white = useRef(null);
  const pink = useRef(null);
  const brown = useRef(null);

  const [toggle, setToggle] = useToggle(true);

  function setNoiseType(type) {
    setType({ color: type.color, active: true });
    noise.type = type.color;
    noise.start().toMaster();
  }

  function onChange(e) {
    ref.current.focus();
    setVolume(e.target.value);
    noise.volume.value = e.target.value;
  }

  var dist = new Tone.Filter({
    type: 'lowpass',
    frequency: 400,
    rolloff: -12,
    Q: 4,
    gain: 1,
  }).toMaster();

  //play a middle 'C' for the duration of an 8th note

  function handleKeyDown(event) {
    // console.log(event.keyCode);
    // if (event.keyCode === 65) {
    //   noise.start();
    // } else if (event.keyCode === 83) {
    //   noise.connect(dist);
    // } else if (event.keyCode === 76) {
    // } else if (event.keyCode === 49) {
    // } else if (event.keyCode === 50) {
    // } else if (event.keyCode === 48) {
    //   noise.volume.value = vol += 1;
    // } else if (event.keyCode === 57) {
    //   noise.volume.value = vol -= 1;
    // } else if (event.keyCode === 32) {
    //   noise.stop();
    // }
  }

  function onKeyDown(event) {
    if (event.keyCode === 48) {
      setVolume(
        Math.floor(
          noise.volume.value <= 0
            ? (noise.volume.value += 1)
            : noise.volume.value,
        ),
      );
    }
    if (event.keyCode === 57) {
      setVolume(
        Math.floor(
          noise.volume.value >= -99
            ? (noise.volume.value -= 1)
            : noise.volume.value,
        ),
      );
    }
    if (event.keyCode === 13 && noise.state === 'started') {
      setMute();
      setToggle();
    } else {
      setNoiseType(type);
      setToggle();
    }
  }

  useEffect(() => {}, [volume, noise, toggle]);

  function changeFilter() {
    noise.connect(dist);
  }

  function setMute() {
    noise.mute = toggle;
  }

  function press(e) {
    console.log(type);
    console.log(e.keyCode);
    if (e.keyCode === 56) {
      ref.current.focus();
    } else if (e.keyCode === 49) {
      white.current.focus();
      setNoiseType({ color: 'white', active: true });
    } else if (e.keyCode === 50) {
      pink.current.focus();
      setNoiseType({ color: 'pink', active: true });
    } else if (e.keyCode === 51) {
      brown.current.focus();
      setNoiseType({ color: 'brown', active: true });
    }
  }

  return (
    <div style={{ transition: '1s' }} tabIndex="0" onKeyDown={e => press(e)}>
      <h1>White Noise</h1>
      <p>{Number(Math.floor(volume)) + 100}%</p>
      {focus ? 'use 9-0' : 'no'}
      <div class="slidecontainer">
        <input
          ref={ref}
          id={noise.mute ? 'volume' : 'volume-static'}
          type="range"
          min="-100"
          defaultValue="-20"
          step="1"
          max="0"
          onChange={e => onChange(e)}
          onKeyDown={e => onKeyDown(e)}
          value={volume}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />
      </div>
      {[
        { color: 'white', active: false },
        { color: 'pink', active: false },
        { color: 'brown', active: false },
      ].map((color, i) => (
        <button
          key={i}
          ref={eval(color.color)}
          className={` button ${
            color.color === type.color ? type.color : 'unselected'
          }`}
          onClick={() => {
            ref.current.focus();
            setNoiseType(color);
          }}
        >
          {color.color}
        </button>
      ))}
      <br></br>

      {noise.state !== 'stopped' ? (
        <button
          className={` button ${type.color}`}
          onClick={() => {
            setToggle();
            setMute();
          }}
        >
          {!noise.mute && noise.state ? 'Stop' : 'Start'}
        </button>
      ) : null}
    </div>
  );
}

export default App;
