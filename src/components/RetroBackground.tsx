import { motion } from 'motion/react';

export default function RetroBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-bg-color">
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          background: `
            radial-gradient(circle at 10% 20%, rgba(0, 242, 255, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 90% 80%, rgba(255, 0, 255, 0.08) 0%, transparent 40%)
          `
        }}
      />
    </div>
  );
}
