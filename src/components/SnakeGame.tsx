import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Point, GameStatus } from '../types';

interface SnakeGameProps {
  snake: Point[];
  food: Point;
  status: GameStatus;
  score: number;
  setStatus: (status: GameStatus) => void;
  resetGame: () => void;
  gridSize: number;
}

export default function SnakeGame({
  snake,
  food,
  status,
  score,
  setStatus,
  resetGame,
  gridSize,
}: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / gridSize;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#ffffff' : '#ff00ff';
      ctx.shadowBlur = isHead ? 15 : 5;
      ctx.shadowColor = isHead ? '#ffffff' : '#ff00ff';
      
      const x = segment.x * cellSize;
      const y = segment.y * cellSize;
      const size = cellSize - 4;
      
      ctx.fillRect(x + 2, y + 2, size, size);
      
      // Glitch jitters for the body
      if (Math.random() > 0.98) {
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(x + 5, y, 10, 2);
      }
    });

    // Draw food
    ctx.fillStyle = '#00ffff';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#00ffff';
    ctx.beginPath();
    ctx.rect(
      food.x * cellSize + 4,
      food.y * cellSize + 4,
      cellSize - 8,
      cellSize - 8
    );
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;
  }, [snake, food, gridSize]);

  return (
    <div className="flex flex-col items-center justify-center scale-110">
      {/* Game Canvas */}
      <div className="relative border-[4px] border-white bg-black">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="block animate-tear"
        />

        {/* Overlays */}
        <AnimatePresence>
          {status !== 'PLAYING' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black flex flex-col items-center justify-center p-6 z-20"
            >
              {status === 'IDLE' && (
                <div className="text-center">
                  <h3 className="text-[28px] font-display text-white mb-20 glitch-text leading-none" data-text="_SYSTEM_INITIATING_">_SYSTEM_INITIATING_</h3>
                  <button
                    onClick={() => setStatus('PLAYING')}
                    className="neon-block-cyan w-full text-[16px] py-4"
                  >
                    _BOOT_NODE_0
                  </button>
                </div>
              )}

              {status === 'PAUSED' && (
                <div className="text-center space-y-10">
                  <h3 className="text-[28px] font-display text-neon-cyan glitch-text uppercase" data-text="_SYNC_SUSPENDED_">_SYNC_SUSPENDED_</h3>
                  <button
                    onClick={() => setStatus('PLAYING')}
                    className="neon-block-cyan px-16 py-4"
                  >
                    _RESUME
                  </button>
                </div>
              )}

              {status === 'GAME_OVER' && (
                <div className="text-center space-y-8">
                  <h3 className="text-[32px] font-display text-white mb-4 glitch-text" data-text="_REALITY_CRASH_">_REALITY_CRASH_</h3>
                  <div className="font-mono text-[18px] bg-white text-black p-3 inline-block font-bold">SCORE_DUMP: {score}</div>
                  <button
                    onClick={resetGame}
                    className="neon-block-cyan w-full py-4 text-[16px]"
                  >
                    _RELOAD_KERNEL
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Interface Hint */}
      <div className="mt-8 grid grid-cols-2 gap-4 w-full">
        <div className="flex items-center gap-3 border-2 border-white/20 p-2 bg-black/40">
          <span className="key-cap">WASD</span>
          <span className="text-[10px] font-mono text-white/60">_DIRECT_VEC</span>
        </div>
        <div className="flex items-center gap-3 border-2 border-white/20 p-2 bg-black/40">
          <span className="key-cap">SPACE</span>
          <span className="text-[10px] font-mono text-white/60">_CMD_FORCE</span>
        </div>
      </div>
    </div>
  );
}
