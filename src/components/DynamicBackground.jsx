import React, { useEffect, useRef } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useLocation } from 'react-router-dom';

const MatrixCanvas = ({ colorPrimary, colorFade }) => {
    const ref = useRef(null);
    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let W = canvas.width = window.innerWidth;
        let H = canvas.height = window.innerHeight;
        const cols = Math.floor(W / 20);
        const drops = Array(cols).fill(1);
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;,.<>?/\\~`FAF⬡◈⬢✦⊕';

        let id;
        const draw = () => {
            ctx.fillStyle = 'rgba(2,6,23,0.07)';
            ctx.fillRect(0, 0, W, H);
            ctx.font = '13px monospace';
            for (let i = 0; i < drops.length; i++) {
                const char = chars[Math.floor(Math.random() * chars.length)];
                const x = i * 20;
                const y = drops[i] * 20;
                ctx.fillStyle = drops[i] * 20 < 40 ? colorPrimary : colorFade(Math.random() * 0.5 + 0.1);
                ctx.fillText(char, x, y);
                if (y > H && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            }
            id = requestAnimationFrame(draw);
        };
        draw();
        const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
        window.addEventListener('resize', resize);
        return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize); };
    }, [colorPrimary, colorFade]);
    return <canvas ref={ref} className="absolute inset-0 pointer-events-none" style={{ opacity: 0.03 }} />;
};

const ParticleNet = ({ color1, color2 }) => {
    const ref = useRef(null);
    useEffect(() => {
        const c = ref.current; if (!c) return;
        const ctx = c.getContext('2d');
        let W = c.width = window.innerWidth;
        let H = c.height = window.innerHeight;
        const N = 60;
        const pts = Array.from({ length: N }, () => ({
            x: Math.random() * W, y: Math.random() * H,
            vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5,
            r: Math.random() * 1.5 + .5,
        }));
        let id;
        const draw = () => {
            ctx.clearRect(0, 0, W, H);
            for (let i = 0; i < N; i++) {
                for (let j = i + 1; j < N; j++) {
                    const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < 130) {
                        const alpha = 0.25 * (1 - d / 130);
                        const g = ctx.createLinearGradient(pts[i].x, pts[i].y, pts[j].x, pts[j].y);
                        g.addColorStop(0, color1(alpha));
                        g.addColorStop(1, color2(alpha));
                        ctx.strokeStyle = g;
                        ctx.lineWidth = .8;
                        ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
                    }
                }
            }
            pts.forEach(p => {
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = Math.random() > .5 ? color1(0.6) : color2(0.6);
                ctx.fill();
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > W) p.vx *= -1;
                if (p.y < 0 || p.y > H) p.vy *= -1;
            });
            id = requestAnimationFrame(draw);
        };
        draw();
        const r = () => { W = c.width = window.innerWidth; H = c.height = window.innerHeight; };
        window.addEventListener('resize', r);
        return () => { cancelAnimationFrame(id); window.removeEventListener('resize', r); };
    }, [color1, color2]);
    return <canvas ref={ref} className="absolute inset-0 pointer-events-none" style={{ opacity: .55 }} />;
};

const DynamicBackground = () => {
    const { user } = useAuth();
    const location = useLocation();

    // Do not show on unauthenticated views since they are uniquely designed
    if (!user) return null;

    // Determine colors based on role
    const isManager = user?.role === 'manager';
    const isEmployer = user?.role === 'employer';
    
    // Default (Worker): Cyan & Purple
    let matrixPrimary = '#67e8f9';
    let matrixFade = (alpha) => `rgba(6,182,212,${alpha})`;
    let particle1 = (alpha) => `rgba(6,182,212,${alpha})`;
    let particle2 = (alpha) => `rgba(139,92,246,${alpha})`;
    
    let scanlineColor = 'rgba(0,255,255,0.015)';
    let orb1Class = 'bg-cyan-500/5';
    let orb2Class = 'bg-purple-600/5';

    if (isManager) {
        // Manager: Emerald & Teal
        matrixPrimary = '#bd93f9'; // wait, emerald is greener
        matrixPrimary = '#34d399';
        matrixFade = (alpha) => `rgba(16,185,129,${alpha})`;
        particle1 = (alpha) => `rgba(16,185,129,${alpha})`;
        particle2 = (alpha) => `rgba(20,184,166,${alpha})`;
        
        scanlineColor = 'rgba(16,185,129,0.015)';
        orb1Class = 'bg-emerald-500/5';
        orb2Class = 'bg-teal-600/5';
    } else if (isEmployer) {
        // Employer: Indigo & Blue
        matrixPrimary = '#818cf8';
        matrixFade = (alpha) => `rgba(99,102,241,${alpha})`;
        particle1 = (alpha) => `rgba(99,102,241,${alpha})`;
        particle2 = (alpha) => `rgba(59,130,246,${alpha})`;
        
        scanlineColor = 'rgba(99,102,241,0.015)';
        orb1Class = 'bg-indigo-500/5';
        orb2Class = 'bg-blue-600/5';
    }

    return (
        <div className="fixed inset-0 z-[-1] bg-[#020617] overflow-hidden pointer-events-none">
            {/* Layers */}
            <MatrixCanvas colorPrimary={matrixPrimary} colorFade={matrixFade} />
            <ParticleNet color1={particle1} color2={particle2} />

            {/* Scanlines overlay */}
            <div className="absolute inset-0 pointer-events-none"
                style={{ backgroundImage: `repeating-linear-gradient(0deg, ${scanlineColor} 0px, ${scanlineColor} 1px, transparent 1px, transparent 3px)`, backgroundSize: '100% 3px' }} />

            {/* Glow orbs min-h-screen */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden h-full w-full">
                <div className={`absolute top-0 left-1/4 w-[500px] h-[500px] ${orb1Class} rounded-full blur-[120px] animate-[pulse_8s_ease-in-out_infinite]`} />
                <div className={`absolute bottom-0 right-1/4 w-[400px] h-[400px] ${orb2Class} rounded-full blur-[100px] animate-[pulse_10s_ease-in-out_infinite_3s]`} />
            </div>
        </div>
    );
};

export default DynamicBackground;
