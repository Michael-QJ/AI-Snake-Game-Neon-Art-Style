import { Song } from '../types';
import { Play, Pause, SkipForward, SkipBack, Repeat, Shuffle, Terminal } from 'lucide-react';

interface PlayerBarProps {
  currentSong: Song;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSkipForward: () => void;
  onSkipBackward: () => void;
  progress: number;
}

export default function PlayerBar({
  currentSong,
  isPlaying,
  onTogglePlay,
  onSkipForward,
  onSkipBackward,
  progress,
}: PlayerBarProps) {
  return (
    <div className="h-[120px] bg-black border-t-[4px] border-white flex items-center px-10 gap-10 fixed bottom-0 left-0 right-0 z-50">
      <div className="noise-overlay" />
      
      {/* Now Playing Component */}
      <div className="flex items-center gap-6 w-[360px]">
        <div className="w-16 h-16 border-[3px] border-neon-magenta flex-shrink-0">
          <img src={currentSong.cover} className="w-full h-full object-cover grayscale" alt="SIGNAL" referrerPolicy="no-referrer" />
        </div>
        <div className="min-w-0 bg-white border-4 border-white">
          <div className="bg-white text-black px-2 py-0.5 font-display text-[14px] leading-none truncate uppercase">{currentSong.title}</div>
          <div className="bg-black text-white px-2 py-1 font-mono text-[10px] tracking-widest uppercase">{currentSong.artist}</div>
        </div>
      </div>

      {/* Logic Gates Controls */}
      <div className="flex-1 flex flex-col items-center gap-3">
        <div className="flex items-center gap-10">
          <button className="text-white hover:text-neon-cyan transition-colors"><Repeat className="w-6 h-6" /></button>
          <button onClick={onSkipBackward} className="text-neon-cyan hover:scale-110"><SkipBack className="w-8 h-8 fill-current" /></button>
          
          <button 
            onClick={onTogglePlay}
            className="w-[68px] h-[68px] border-[4px] border-white bg-black hover:bg-white text-white hover:text-black flex items-center justify-center transition-all"
          >
            {isPlaying ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-1" />}
          </button>

          <button onClick={onSkipForward} className="text-neon-cyan hover:scale-110"><SkipForward className="w-8 h-8 fill-current" /></button>
          <button className="text-white hover:text-neon-cyan transition-colors"><Shuffle className="w-6 h-6" /></button>
        </div>

        {/* Data Stream Progress */}
        <div className="w-full max-w-[600px] flex items-center gap-4">
          <span className="text-[12px] font-mono text-neon-magenta font-bold">SGNL:00</span>
          <div className="h-6 w-full border-2 border-white relative bg-black">
            <div 
              className="h-full bg-white border-r-4 border-white" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[12px] font-mono text-white">3:45</span>
        </div>
      </div>

      {/* Audio Buffer Output */}
      <div className="w-[300px] flex items-center gap-4 justify-end">
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-display text-white mb-2 underline underline-offset-4">_OUTPUT_GAIN_</span>
          <div className="flex gap-1 h-5">
            {[...Array(12)].map((_, i) => (
              <div key={i} className={`w-3 h-full border border-white ${i < 10 ? 'bg-neon-magenta' : 'bg-transparent'}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
