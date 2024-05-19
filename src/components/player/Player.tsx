import { useTimer } from '@/hooks/useTimer';
import React, { useEffect, useRef, useState } from 'react';

import 'shaka-player/dist/controls.css';
const shaka = require('shaka-player/dist/shaka-player.ui.js');

let player: any;
let intervalID: any;

interface PlayerProps {
  manifestUrl?: string
  licenseServer?: string
  posterUrl?: string
  showControls?: boolean
  isOverlay?: boolean
  currentSection?: any
  fullControls?: boolean
  rewindFunction?: any
  skipFunction?: any
  forwardFunction?: any
  onPlayVideo?: any
  isSafari?: boolean
  isTrailer?: boolean
  setCurrentPlayer?(player: any): void
  setCurrentDuration?(duration_second: number): void
}

export default function Player(props: PlayerProps) {
  const shaka = useRef();

  const [isShow, setShow] = useState(true);

  useEffect(() => {
    setShow(false);
    setTimeout(() => {
      setShow(true);
      if (intervalID) {
        clearInterval(intervalID);
      }
      intervalID = null;
    }, 200);
  }, [props.manifestUrl, shaka.current]);

  return (
    <div style={{ height: isShow ? '' : '530px' }}>
      {isShow && <Player2 {...props} />}
    </div>
  );
}

function Player2(props: PlayerProps) {
  const video: any = useRef();
  const videoContainer: any = useRef();
  const [showOverlay, setShowOverlay] = useState(false);
  const [time, setTime] = useState(null);

  function insertAfter(referenceNode: any, src: any, id: any, callback: any) {
    const el = document.createElement('button');
    el.addEventListener('click', callback);

    const img = document.createElement('img');
    img.src = src;
    img.id = id;

    el.appendChild(img);
    referenceNode?.insertAdjacentElement('afterend', el);
  }

  function initPlayer(video_manifest_uri: any) {
    // initialize shaka
    const _video = video.current;
    const _videoContainer = videoContainer.current;
    player = new shaka.Player(_video);

    if (props.setCurrentPlayer) {
      props.setCurrentPlayer(player);
    }

    new shaka.ui.Overlay(player, _videoContainer, _video);

    // customize controls
    const videoPlayer: any = document.getElementById('video');
    const uiPlayer: any = videoPlayer['ui'];
    const _config: any = props.showControls
      ? {
        addBigPlayButton: true,
        addSeekBar: true,
        overflowMenuButtons: ['quality'],
        seekBarColors: {
          base: 'rgba(196, 196, 196, 0.3)',
          buffered: '#c4c4c4',
          played: '#005CB9',
        },
        enableKeyboardPlaybackControls: false,
      }
      : {
        addBigPlayButton: true,
        addSeekBar: false,
        controlPanelElements: [],
        overflowMenuButtons: [],
        seekBarColors: {
          base: 'rgba(196, 196, 196, 0.3)',
          buffered: '#c4c4c4',
          played: '#005CB9',
          overflowMenuButtons: ['quality', 'playback_rate'],
        },
      };

    if (typeof uiPlayer?.configure !== 'undefined') {
      uiPlayer.configure(_config);
    }

    // swap the player controls
    swapControls();

    // fullcontrols to Video player
    if (props.fullControls) {
      addControls();
    }

    if (props.isSafari) {
      player
        .load(video_manifest_uri)
        .then(function () {
          console.log('The video has now been loaded!');
        })
        .catch((error: any) => {
          console.error('Error code', error.code, 'object', error);
        });
    } else {
      player.addEventListener('error', (err: any) => console.log('ERR', err));
      player
        .load(video_manifest_uri)
        .then(function () {
          console.log('The video has now been loaded!');
        })
        .catch((error: any) => {
          console.error('Error code', error.code, 'object', error);
        });
    }

    return player;
  }

  function swapControls() {
    const control: any = document.querySelector('.shaka-bottom-controls');
    control.appendChild(control.firstElementChild);
    control.appendChild(control.firstElementChild);
  }

  function addControls() {
    document.createElement('button');
    let div = document.getElementsByClassName('shaka-small-play-button')[0];
    if (!div) {
      div = document.getElementsByClassName('shaka-current-time')[0];
    }

    insertAfter(div, '/icons/icon-skip.svg', 'skip-button', props.skipFunction);
    insertAfter(div, '/icons/icon-forward-10.svg', 'forward-button', props.forwardFunction);
    insertAfter(div, '/icons/icon-rewind-10.svg', 'rewind-button', props.rewindFunction);

    const seekBar: any = document.getElementsByClassName('shaka-seek-bar')[0];
    if (seekBar) {
      seekBar.disabled = false;
    }
  }

  function reload(newMpdUrl: any) {
    if (!newMpdUrl) {
      return;
    }

    initPlayer(newMpdUrl);
    if (props.currentSection?.duration) {
      const video: any = document.getElementById('video');
      video.currentTime = props.currentSection?.duration || 0;
    }
  }

  const countDownVideo = () => {
    const countDownDate = new Date().getTime() + 11200;

    intervalID = setInterval(() => {
      const now = new Date().getTime();
      const distance = countDownDate - now;
      const seconds: any = Math.floor((distance % (1000 * 60)) / 1000);
      setTime(seconds);
      if (distance < 500) {
        clearInterval(intervalID);
        nextVideo();
      }
    }, 500);
  };

  const endedVideo = () => {
    setShowOverlay(true);

    if (!props.isTrailer) {
      countDownVideo();
    }
  };

  const replayVideo = () => {
    setShowOverlay(false);

    clearInterval(intervalID);
    intervalID = null;

    const video: any = document.getElementById('video');
    video.currentTime = 0;
    video.play();
  };

  const nextVideo = () => {
    setShowOverlay(false);

    props.skipFunction();
  };

  useEffect(() => {
    reload(props.manifestUrl);
    setTime(null);

    return () => {
      if (typeof player !== 'undefined' && player.destroy) {
        player.destroy();
      }
    };
  }, [props.manifestUrl]);

  useTimer(() => {
    const current_time = (document.getElementById('video') as any)?.currentTime ?? 0;
    props.setCurrentDuration && props.setCurrentDuration(current_time);
  }, 2);

  return (
    <div
      className="shadow-lg mx-auto max-w-full"
      ref={videoContainer}
      style={{
        width: '100%',
        justifyContent: 'center',
        height: '100%',
      }}
    >
      <video
        id="video"
        style={{
          margin: '0 auto',
          width: '100%',
          height: 'auto',
        }}
        ref={video}
        className="w-full h-full"
        autoPlay={false}
        poster={props.posterUrl}
        onEnded={endedVideo}
        onPlay={props.onPlayVideo}
      />
      {props.isOverlay && showOverlay && (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'rgba(20, 20, 20, 0.9)',
            position: 'absolute',
            zIndex: 2,
            display: 'grid',
            alignContent: 'center',
            justifyItems: 'center',
          }}>
          <p
            style={{
              fontSize: '16px',
              color: '#626262',
              position: 'absolute',
              left: '50px',
              top: '40px',
            }}>
            Video selanjutnya <span style={{ color: '#fdfdfd' }}>{time}</span>
          </p>
          <button
            className="overlay-button"
            style={{
              borderRadius: '5px',
              fontSize: '16px',
              height: '50px',
              width: '250px',
              backgroundColor: '#005CB9',
              color: '#fdfdfd',
              fontWeight: '600',
            }}
            onClick={() => {
              nextVideo();
            }}>
            Putar Video Selanjutnya
          </button>
          <button
            style={{
              borderRadius: '5px',
              fontSize: '16px',
              height: '50px',
              width: '250px',
              backgroundColor: 'transparent',
              border: '1px solid #c4c4c4',
              color: '#c4c4c4',
              fontWeight: '600',
            }}
            className="overlay-button"
            onClick={replayVideo}
          >
            Putar Ulang
          </button>
        </div>
      )}
    </div>
  );
}