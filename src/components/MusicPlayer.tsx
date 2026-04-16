import { Song } from '../types';
import { SONGS } from '../constants';

interface PlaylistProps {
  currentSongIndex: number;
  setCurrentSongIndex: (index: number) => void;
}

export default function MusicPlayer({ currentSongIndex, setCurrentSongIndex }: PlaylistProps) {
  return (
    <div className="brutal-pane h-full flex flex-col">
      <div className="text-[16px] font-display text-white mb-8 animate-tear glitch-text glitch-underline" data-text="_SYSTEM_PLAYLIST_EXTRACT_">
        _SYSTEM_PLAYLIST_EXTRACT_
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-none">
        {SONGS.map((song, idx) => (
          <button
            key={song.id}
            onClick={() => setCurrentSongIndex(idx)}
            className={`w-full flex items-center gap-4 p-3 transition-all border-2 ${
              idx === currentSongIndex 
                ? 'bg-neon-magenta border-white text-black' 
                : 'bg-black text-white border-white/20 hover:border-white'
            }`}
          >
            <div className={`w-14 h-14 border-2 shrink-0 ${idx === currentSongIndex ? 'border-black' : 'border-white'}`}>
              <img 
                src={song.cover} 
                className={`w-full h-full object-cover grayscale contrast-125 ${idx === currentSongIndex ? 'invert' : ''}`} 
                alt={song.title}
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-left flex-1 min-w-0">
              <div className="text-[14px] font-display truncate uppercase">
                {song.title}
              </div>
              <div className="text-[10px] font-mono opacity-80 mt-1">[{song.artist}]</div>
            </div>
            {idx === currentSongIndex && (
              <div className="pixel-active-block" />
            )}
          </button>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t-2 border-dashed border-white/20 text-[10px] font-mono opacity-50">
        MEMORY_ALLOCATED: 128MB<br/>
        ENCRYPTION: ACTIVE
      </div>
    </div>
  );
}
