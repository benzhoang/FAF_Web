import React, { useEffect, useRef } from 'react';

const AudioWaveform = ({ isPlaying, currentTime, duration }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationId;
    const bars = 80;
    const barData = Array.from({ length: bars }, () => Math.random() * 0.8 + 0.2);

    const render = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / bars;
      const progress = currentTime / duration || 0;

      for (let i = 0; i < bars; i++) {
        const x = i * barWidth;
        const h = barData[i] * canvas.height;
        const y = (canvas.height - h) / 2;

        const isPlayed = (i / bars) <= progress;
        
        // Gradient for bars
        const gradient = ctx.createLinearGradient(0, y, 0, y + h);
        if (isPlayed) {
          gradient.addColorStop(0, '#10b981'); // Emerald
          gradient.addColorStop(1, '#059669');
        } else {
          gradient.addColorStop(0, '#1e293b'); // Slate 800
          gradient.addColorStop(1, '#0f172a');
        }

        ctx.fillStyle = gradient;
        // Rounded bar logic
        ctx.beginPath();
        const radius = 2;
        ctx.roundRect(x + 2, y, barWidth - 4, h, radius);
        ctx.fill();

        // Pulsing effect if playing
        if (isPlaying && Math.abs((i / bars) - progress) < 0.05) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#10b981';
          ctx.fillRect(x + 2, y, barWidth - 4, h);
          ctx.shadowBlur = 0;
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying, currentTime, duration]);

  return (
    <div className="w-full h-12 bg-[#02040a]/50 rounded-lg border border-slate-800/50 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default AudioWaveform;
