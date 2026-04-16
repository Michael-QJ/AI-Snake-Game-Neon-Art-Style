/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import PlayerBar from './components/PlayerBar';
import { SONGS } from './constants';
import { useSnake } from './hooks/useSnake';

export default function App() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentSong = SONGS[currentSongIndex];

  // Lifted Snake Game State
  const snakeGame = useSnake();

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSongIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const skipForward = () => {
    setCurrentSongIndex((prev) => (prev + 1) % SONGS.length);
  };

  const skipBackward = () => {
    setCurrentSongIndex((prev) => (prev - 1 + SONGS.length) % SONGS.length);
  };

  return (
    <div className="h-screen w-screen selection:bg-neon-magenta flex flex-col relative overflow-hidden bg-black">
      <div className="noise-overlay" />
      
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={currentSong.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={skipForward}
      />

      {/* Main Grid: Brutalist Layout */}
      <main className="grid grid-cols-[320px_1fr_280px] gap-6 p-10 h-[calc(100vh-120px)] relative z-10">
        {/* Left: Signal Cache */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="h-full"
        >
          <MusicPlayer 
            currentSongIndex={currentSongIndex} 
            setCurrentSongIndex={(idx) => {
              setCurrentSongIndex(idx);
              setIsPlaying(true);
            }} 
          />
        </motion.div>

        {/* Center: Logic Grid Reactor */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="brutal-pane flex flex-col items-center justify-center relative overflow-hidden"
        >
          <div className="absolute top-2 left-2 text-[10px] font-mono text-white opacity-40">_REACTOR_STATUS_ACTIVE_</div>
          <div className="absolute top-2 right-2 flex gap-1">
            <div className="w-2 h-2 bg-neon-cyan animate-pulse" />
            <div className="w-2 h-2 bg-neon-magenta animate-pulse" />
          </div>
          <SnakeGame {...snakeGame} />
        </motion.div>

        {/* Right: Telemetry & Logs */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="brutal-pane flex flex-col pt-12"
        >
          <div className="mb-10 text-center">
            <div className="text-[14px] font-display text-white mb-6 uppercase tracking-widest leading-none">_DATA_TEL_01_</div>
            <div className="text-[100px] font-display text-white leading-[0.8] glitch-text flex justify-center tracking-[-10px]" data-text={snakeGame.score.toLocaleString().padStart(6, '0')}>
              {snakeGame.score.toLocaleString().padStart(6, '0')}
            </div>
            <div className="h-4 w-full bg-white mt-10" />
          </div>

          <div className="mb-12">
            <div className="text-[10px] font-mono text-neon-magenta uppercase mb-2 font-bold tracking-tighter">_MAX_THRESHOLD_</div>
            <div className="text-[44px] font-display text-white leading-none">04,220</div>
          </div>
          
          <div className="mt-auto flex items-center h-12 border-2 border-white">
            <div className="bg-white text-black h-full flex items-center px-4 font-mono text-[12px] font-bold">_OSV_</div>
            <div className="flex-1 flex justify-end items-center px-4 font-mono text-[12px] text-neon-magenta font-bold">v2.9.glitch.0</div>
          </div>
        </motion.div>
      </main>

      {/* Bottom Interface */}
      <PlayerBar 
        currentSong={currentSong}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onSkipForward={skipForward}
        onSkipBackward={skipBackward}
        progress={progress}
      />
    </div>
  );
}
