import { Flex, Image, Spinner } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react'

// @ts-ignore
import WaveSurfer from 'wavesurfer.js';

interface AudioPlayerProps {
  audio?: string
  h?: number
  onProgressPlay?(progress: number): void // progress on float [0...1]
}

let timeoutRef: NodeJS.Timeout | null = null;
export default function AudioPlayer(props: AudioPlayerProps) {
  const containerRef = useRef(null);
  const waveSurferRef = useRef({
    isPlaying: () => false,
  });
  const [isPlaying, toggleIsPlaying] = useState(false);
  const [isMute, toggleIsMute] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  function togglePlay() {
    if (!waveSurferRef || !waveSurferRef.current || !(waveSurferRef.current as any)?.playPause) {
      return;
    }
    (waveSurferRef.current as any)?.playPause();
    toggleIsPlaying(waveSurferRef.current.isPlaying());
  }

  function toggleMute() {
    if (!waveSurferRef || !waveSurferRef.current || !(waveSurferRef.current as any)?.playPause) {
      return;
    }
    (waveSurferRef.current as any)?.toggleMute();
    toggleIsMute(!isMute);
  }

  useEffect(() => {
    if (!props.audio) {
      return;
    }
    const waveSurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#C4C4C4',
      progressColor: '#005CB9',
      normalize: true,
      height: props.h ?? 80
    })
    waveSurfer.load(props.audio)
    waveSurfer.on('ready', () => {
      waveSurferRef.current = waveSurfer;
      setLoading(false);
    });
    waveSurfer.on('audioprocess', (current_duration: number) => {
      const total_duration = waveSurfer.getDuration();
      const progress = current_duration / total_duration;
      if (timeoutRef) {
        return;
      }
      timeoutRef = setTimeout(() => {
        props.onProgressPlay && props.onProgressPlay(progress);
        if (timeoutRef) {
          clearTimeout(timeoutRef);
          timeoutRef = null;
        }
      }, 1000);
    });

    return () => {
      waveSurfer.destroy()
    }
  }, [props.audio]);

  return (
    <Flex
      w={'100%'}
      align={'center'}
      gap={'36px'}>
      <Flex 
        gap={'24px'}>
        { !isPlaying && <Image
          src={'/icons/audio-forward.svg'}
          w={'36px'}
          h={'36px'}
          onClick={togglePlay}
          objectFit={'contain'} /> }
        { isPlaying && <Image
          src={'/icons/audio-pause.svg'}
          w={'36px'}
          h={'36px'}
          onClick={togglePlay}
          objectFit={'contain'} /> }
        { !isMute && <Image
          src={'/icons/audio-unmute.svg'}
          w={'36px'}
          onClick={toggleMute}
          h={'36px'}
          objectFit={'contain'} /> }
        { isMute && <Image
          src={'/icons/audio-mute.svg'}
          w={'36px'}
          onClick={toggleMute}
          h={'36px'}
          objectFit={'contain'} /> }
      </Flex>
      {/* <button
        type="button">
        { isPlaying ? 'Pause' : 'Play' }
      </button> */}
      <Flex
        align={'center'}
        justify={'center'}
        flex={1}
        h={props.h ?? '80px'}>
        { loading && <Flex
          alignSelf={'center'}
          align={'center'}>
          <Spinner />
        </Flex> }
        <div 
          ref={containerRef}
          style={{
            width: '100%',
            height: props.h ?? 80
          }} />
      </Flex>
    </Flex>
  )
}
