import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

// All dark gradient/bg inline styles → override to white/light in light mode
const LIGHT_MODE_STYLE_ID = 'faf-light-mode-overrides';

const injectLightStyles = () => {
    if (document.getElementById(LIGHT_MODE_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = LIGHT_MODE_STYLE_ID;
    style.textContent = `
        /* ═══ FAF LIGHT MODE OVERRIDES ═══ */

        /* 1. Reset gradient images only on structural layout elements (not * wildcard to avoid breaking SVG/masks) */
        html[data-theme="light"] div,
        html[data-theme="light"] aside,
        html[data-theme="light"] section,
        html[data-theme="light"] article,
        html[data-theme="light"] header,
        html[data-theme="light"] footer,
        html[data-theme="light"] main,
        html[data-theme="light"] nav {
            background-image: none !important;
        }

        /* 2. Page base */
        html[data-theme="light"],
        html[data-theme="light"] body,
        html[data-theme="light"] #root {
            background-color: #f0f4f8 !important;
            color: #1e293b !important;
        }

        /* 3. Navbar always white */
        html[data-theme="light"] nav {
            background: rgba(255,255,255,0.97) !important;
            border-bottom-color: rgba(148,163,184,0.3) !important;
        }

        /* 4. Dynamic background canvas - visible but soft in light mode */
        html[data-theme="light"] canvas {
            opacity: 0.18 !important;
            mix-blend-mode: multiply !important;
        }

        /* 5. DynamicBackground fixed wrapper → light airy gradient */
        html[data-theme="light"] .fixed.inset-0 {
            background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 40%, #ede9fe 80%, #dbeafe 100%) !important;
        }

        /* 6. Dark Tailwind utility classes */
        html[data-theme="light"] .bg-slate-900,
        html[data-theme="light"] .bg-slate-950,
        html[data-theme="light"] .bg-slate-800,
        html[data-theme="light"] .bg-slate-900\\/70,
        html[data-theme="light"] .bg-slate-900\\/80,
        html[data-theme="light"] .bg-slate-900\\/90,
        html[data-theme="light"] .bg-slate-950\\/90 {
            background-color: rgba(255, 255, 255, 0.5) !important;
            backdrop-filter: blur(12px) !important;
        }

        /* 7. Specific dark arbitrary Tailwind BG classes used in project */
        html[data-theme="light"] .bg-\\[\\#020617\\],
        html[data-theme="light"] .bg-\\[\\#02040a\\],
        html[data-theme="light"] .bg-\\[\\#030014\\],
        html[data-theme="light"] .bg-\\[\\#050810\\],
        html[data-theme="light"] .bg-\\[\\#090e17\\],
        html[data-theme="light"] .bg-\\[\\#0a1128\\] {
            background-color: rgba(255, 255, 255, 0.5) !important;
        }

        /* 8. Dark inline backgrounds - target by content */
        html[data-theme="light"] div[style*="#0d1224"],
        html[data-theme="light"] div[style*="#0f172a"],
        html[data-theme="light"] div[style*="#02040a"],
        html[data-theme="light"] div[style*="#020617"],
        html[data-theme="light"] div[style*="#082f49"],
        html[data-theme="light"] div[style*="#090e17"],
        html[data-theme="light"] div[style*="#4c1d95"],
        html[data-theme="light"] div[style*="#047857"],
        html[data-theme="light"] div[style*="rgba(2,4,10"],
        html[data-theme="light"] div[style*="rgba(9,14,23"],
        html[data-theme="light"] div[style*="rgba(15,23,42"],
        html[data-theme="light"] div[style*="rgba(2, 6, 23"],
        html[data-theme="light"] div[style*="rgba(15, 23, 42"] {
            background: rgba(255, 255, 255, 0.5) !important;
            border-color: rgba(148, 163, 184, 0.25) !important;
        }

        /* 9. Backdrop-blur panels (dropdowns, modals) */
        html[data-theme="light"] .backdrop-blur-xl,
        html[data-theme="light"] .backdrop-blur-md,
        html[data-theme="light"] .backdrop-blur-sm {
            background: rgba(255,255,255,0.97) !important;
        }

        /* 10. Accent-tinted cards */
        html[data-theme="light"] .bg-cyan-900\\/30 { background-color: #ecfeff !important; }
        html[data-theme="light"] .bg-emerald-900\\/30 { background-color: #ecfdf5 !important; }
        html[data-theme="light"] .bg-purple-900\\/30,
        html[data-theme="light"] .bg-indigo-900\\/30 { background-color: #eef2ff !important; }
        html[data-theme="light"] .bg-amber-900\\/30 { background-color: #fffbeb !important; }
        html[data-theme="light"] .bg-red-900\\/30,
        html[data-theme="light"] .bg-rose-950\\/30 { background-color: #fff1f2 !important; }

        /* 11. Text colors: make white/light slate → dark */
        html[data-theme="light"] .text-white { color: #0f172a !important; }
        html[data-theme="light"] .text-slate-100 { color: #1e293b !important; }
        html[data-theme="light"] .text-slate-200 { color: #334155 !important; }
        html[data-theme="light"] .text-slate-300 { color: #475569 !important; }
        html[data-theme="light"] .text-slate-400 { color: #64748b !important; }
        html[data-theme="light"] .text-slate-500 { color: #94a3b8 !important; }

        /* 12. Accent text - darken slightly for readability on white */
        html[data-theme="light"] .text-cyan-400,
        html[data-theme="light"] .text-cyan-500 { color: #0284c7 !important; }
        html[data-theme="light"] .text-cyan-300 { color: #0369a1 !important; }
        html[data-theme="light"] .text-purple-400 { color: #7c3aed !important; }
        html[data-theme="light"] .text-emerald-400 { color: #059669 !important; }
        html[data-theme="light"] .text-emerald-500 { color: #047857 !important; }
        html[data-theme="light"] .text-rose-500 { color: #be123c !important; }
        html[data-theme="light"] .text-amber-400 { color: #b45309 !important; }
        html[data-theme="light"] .text-sky-400 { color: #0284c7 !important; }
        html[data-theme="light"] .text-green-400 { color: #16a34a !important; }
        html[data-theme="light"] .text-indigo-400 { color: #4338ca !important; }
        html[data-theme="light"] .text-purple-300 { color: #7c3aed !important; }
        html[data-theme="light"] .text-green-300 { color: #15803d !important; }
        html[data-theme="light"] .text-amber-300 { color: #b45309 !important; }

        /* 13. Borders */
        html[data-theme="light"] .border-slate-700,
        html[data-theme="light"] .border-slate-800,
        html[data-theme="light"] .border-slate-900 {
            border-color: rgba(148,163,184,0.3) !important;
        }

        /* 13. Inputs → white */
        html[data-theme="light"] input,
        html[data-theme="light"] textarea,
        html[data-theme="light"] select {
            background: #ffffff !important;
            background-color: #ffffff !important;
            color: #1e293b !important;
            border-color: rgba(148,163,184,0.5) !important;
        }
        html[data-theme="light"] input::placeholder,
        html[data-theme="light"] textarea::placeholder {
            color: #94a3b8 !important;
        }

        /* 14. Dropdowns/Backdrop-blur panels */
        html[data-theme="light"] .backdrop-blur-xl,
        html[data-theme="light"] .backdrop-blur-md,
        html[data-theme="light"] .backdrop-blur-sm {
            background: rgba(255,255,255,0.97) !important;
        }

        /* 15. Status bars & overlays with semi-transparent dark */
        html[data-theme="light"] .bg-slate-950\\/90 {
            background-color: rgba(248,250,252,0.97) !important;
        }

        /* 16. Buttons with dark bg */
        html[data-theme="light"] button.bg-\\[\\#02040a\\],
        html[data-theme="light"] button[style*="#02040a"] {
            background: #f8fafc !important;
        }

        /* 17. Hover states */
        html[data-theme="light"] *:hover { background-image: none !important; }

        /* Fix for PostCard bg-gray-900 / bg-gray-800 to be translucent */
        html[data-theme="light"] .bg-gray-900,
        html[data-theme="light"] .bg-gray-800,
        html[data-theme="light"] .bg-gray-700,
        html[data-theme="light"] .bg-\\[\\#1e293b\\] {
            background-color: rgba(255,255,255,0.6) !important;
            backdrop-filter: blur(8px);
        }

        /* 18. Glow orbs in DynamicBackground - hide */
        html[data-theme="light"] .bg-cyan-500\\/5,
        html[data-theme="light"] .bg-purple-600\\/5,
        html[data-theme="light"] .bg-emerald-500\\/5,
        html[data-theme="light"] .bg-indigo-500\\/5 {
            background-color: transparent !important;
        }

        /* 19. Scrollbar */
        html[data-theme="light"] ::-webkit-scrollbar-thumb {
            background-color: rgba(148,163,184,0.5) !important;
        }
        html[data-theme="light"] ::-webkit-scrollbar-track {
            background: #f1f5f9 !important;
        }

        /* 20. PostCard & Social Cards (bg-gray-* classes) */
        html[data-theme="light"] .bg-gray-900,
        html[data-theme="light"] .bg-gray-800,
        html[data-theme="light"] .bg-gray-700 {
            background-color: #ffffff !important;
        }
        html[data-theme="light"] .bg-gray-900\\/90,
        html[data-theme="light"] .bg-gray-800\\/90 {
            background-color: rgba(255,255,255,0.95) !important;
        }
        html[data-theme="light"] .bg-gray-100 {
            background-color: #f8fafc !important;
        }
        html[data-theme="light"] .bg-gray-200 {
            background-color: #f1f5f9 !important;
        }

        /* 21. PostCard text colors */
        html[data-theme="light"] .text-gray-900 { color: #0f172a !important; }
        html[data-theme="light"] .text-gray-800 { color: #1e293b !important; }
        html[data-theme="light"] .text-gray-700 { color: #334155 !important; }
        html[data-theme="light"] .text-gray-600 { color: #475569 !important; }
        html[data-theme="light"] .text-gray-500 { color: #64748b !important; }
        html[data-theme="light"] .text-gray-400 { color: #94a3b8 !important; }

        /* 22. PostCard borders */
        html[data-theme="light"] .border-gray-100,
        html[data-theme="light"] .border-gray-200,
        html[data-theme="light"] .border-gray-700,
        html[data-theme="light"] .border-gray-800 {
            border-color: rgba(148,163,184,0.25) !important;
        }

        /* 23. Hover states on PostCard */
        html[data-theme="light"] .hover\\:bg-gray-100:hover {
            background-color: #f8fafc !important;
        }
        html[data-theme="light"] .hover\\:bg-gray-200:hover {
            background-color: #f1f5f9 !important;
        }

        /* 24. bg-[#1e293b] (slate-800 equivalent used in some places) */
        html[data-theme="light"] [class*="bg-\\[\\#1e293b\\]"],
        html[data-theme="light"] div[style*="#1e293b"],
        html[data-theme="light"] div[style*="#0f1623"],
        html[data-theme="light"] div[style*="#111827"] {
            background-color: #ffffff !important;
        }

        /* 25. CyberPostWrapper's arbitrary variant overrides → revert */
        html[data-theme="light"] .\[\\&_\\.bg-white\\]\\:bg-slate-900\\/90 {
            background-color: #ffffff !important;
        }
    `;
    document.head.appendChild(style);
};

const removeLightStyles = () => {
    const el = document.getElementById(LIGHT_MODE_STYLE_ID);
    if (el) el.remove();
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.classList.toggle('light', theme === 'light');
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('theme', theme);

        if (theme === 'light') {
            injectLightStyles();
        } else {
            removeLightStyles();
        }
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);

