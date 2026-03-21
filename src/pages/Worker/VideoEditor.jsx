import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { useToast } from '../../contexts/ToastContext';

/* ─── Helpers ─── */
const fmt = (s) => {
    s = Math.max(0, Math.floor(s || 0));
    const m = Math.floor(s / 60), sec = s % 60;
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
};

const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 4];
const FILTERS = [
    { name: 'Gốc', css: '' },
    { name: 'Sáng', css: 'brightness(1.3) contrast(1.1)' },
    { name: 'Tối', css: 'brightness(0.7) contrast(1.2)' },
    { name: 'B&W', css: 'grayscale(1)' },
    { name: 'Warm', css: 'sepia(0.4) saturate(1.3)' },
    { name: 'Cool', css: 'hue-rotate(180deg) saturate(0.8)' },
    { name: 'Vintage', css: 'sepia(0.6) contrast(1.1) brightness(0.9)' },
    { name: 'Vivid', css: 'saturate(2) contrast(1.2)' },
];

const FONTS = ['Arial', 'Georgia', 'Courier New', 'Impact', 'Comic Sans MS', 'Verdana'];

/* ─── Main Component ─── */
const VideoEditor = ({ onSubmissionReady }) => {
    const toast = useToast();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const timelineRef = useRef(null);
    const animFrameRef = useRef(null);

    /* Video state */
    const [videoFile, setVideoFile] = useState(null);
    const [videoUrl, setVideoUrl] = useState(null);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    /* Trim */
    const [trimStart, setTrimStart] = useState(0);
    const [trimEnd, setTrimEnd] = useState(0);
    const [dragging, setDragging] = useState(null); // 'start'|'end'

    /* Caption overlays */
    const [captions, setCaptions] = useState([]);
    const [activeCaption, setActiveCaption] = useState(null);
    const [captionText, setCaptionText] = useState('');
    const [captionFont, setCaptionFont] = useState('Arial');
    const [captionSize, setCaptionSize] = useState(32);
    const [captionColor, setCaptionColor] = useState('#ffffff');
    const [captionBg, setCaptionBg] = useState('rgba(0,0,0,0.5)');
    const [captionX, setCaptionX] = useState(50);
    const [captionY, setCaptionY] = useState(85);

    /* Speed */
    const [speed, setSpeed] = useState(1);

    /* Filter */
    const [filterIdx, setFilterIdx] = useState(0);

    /* Color grading */
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [saturation, setSaturation] = useState(100);
    const [hue, setHue] = useState(0);
    const [blur, setBlur] = useState(0);

    /* Transform */
    const [rotation, setRotation] = useState(0); // 0,90,180,270
    const [flipH, setFlipH] = useState(false);
    const [flipV, setFlipV] = useState(false);

    /* Stickers */
    const [stickers, setStickers] = useState([]);
    // { id, emoji, x, y, size, startTime, endTime }
    const EMOJI_LIST = ['😂','❤️','🔥','👍','💯','🎉','✨','😍','🎬','🎵','💪','🌟','😎','🚀','💀','👀','🎤','🎶','💃','🕺'];

    /* PiP Camera */
    const [pipActive, setPipActive] = useState(false);
    const [pipPos, setPipPos] = useState({ x: 70, y: 5 });
    const pipVideoRef = useRef(null);
    const pipStreamRef = useRef(null);

    /* Volume */
    const [volume, setVolume] = useState(1);
    const [muted, setMuted] = useState(false);

    /* Background audio */
    const [bgAudioFile, setBgAudioFile] = useState(null);
    const [bgAudioUrl, setBgAudioUrl] = useState(null);
    const [bgVolume, setBgVolume] = useState(0.5);
    const bgAudioRef = useRef(null);

    /* Cut segments */
    const [cuts, setCuts] = useState([]); // [{start, end, label}]
    const [cutMode, setCutMode] = useState(false);

    /* FFmpeg */
    const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
    const [ffmpegLoading, setFfmpegLoading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [processLog, setProcessLog] = useState('');
    const [processProgress, setProcessProgress] = useState(0);
    const [outputUrl, setOutputUrl] = useState(null);
    const ffmpegRef = useRef(null);

    /* Upload */
    const [uploading, setUploading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState(null);

    /* UI */
    const [activePanel, setActivePanel] = useState('trim');

    /* ── Load FFmpeg ── */
    const loadFFmpeg = async () => {
        if (ffmpegLoaded || ffmpegLoading) return;
        setFfmpegLoading(true);
        setProcessLog('⏳ Đang tải FFmpeg (~30MB), vui lòng chờ...');
        try {
            const ffmpeg = new FFmpeg();
            ffmpeg.on('log', ({ message }) => setProcessLog(message));
            ffmpeg.on('progress', ({ progress }) => setProcessProgress(Math.round(progress * 100)));
            const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
            await ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
            });
            ffmpegRef.current = ffmpeg;
            setFfmpegLoaded(true);
            setProcessLog('✅ FFmpeg sẵn sàng!');
        } catch (e) {
            setProcessLog('❌ Lỗi tải FFmpeg: ' + e.message);
        } finally {
            setFfmpegLoading(false);
        }
    };

    /* ── Video file load ── */
    const handleFileLoad = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setVideoFile(file);
        const url = URL.createObjectURL(file);
        setVideoUrl(url);
        setOutputUrl(null);
        setCuts([]);
    };

    /* ── Sync currentTime from video ── */
    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        const onTime = () => {
            const t = v.currentTime;
            setCurrentTime(t);
            // Enforce trim bounds during playback
            if (t >= trimEnd && trimEnd > 0) {
                v.pause();
                v.currentTime = trimStart;
                setIsPlaying(false);
            }
        };
        const onLoaded = () => {
            const d = v.duration;
            setDuration(d);
            setTrimStart(0);
            setTrimEnd(d);
        };
        v.addEventListener('timeupdate', onTime);
        v.addEventListener('loadedmetadata', onLoaded);
        v.addEventListener('play', () => setIsPlaying(true));
        v.addEventListener('pause', () => setIsPlaying(false));
        return () => {
            v.removeEventListener('timeupdate', onTime);
            v.removeEventListener('loadedmetadata', onLoaded);
        };
    }, [videoUrl, trimStart, trimEnd]);

    /* ── Computed CSS filter (color grading + preset) ── */
    const computedFilter = () => {
        const base = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hue}deg) blur(${blur}px)`;
        const preset = FILTERS[filterIdx].css;
        return preset ? `${preset} ${base}` : base;
    };

    /* ── PiP camera start/stop ── */
    const togglePip = async () => {
        if (pipActive) {
            pipStreamRef.current?.getTracks().forEach(t => t.stop());
            if (pipVideoRef.current) pipVideoRef.current.srcObject = null;
            setPipActive(false);
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                pipStreamRef.current = stream;
                if (pipVideoRef.current) { pipVideoRef.current.srcObject = stream; pipVideoRef.current.play(); }
                setPipActive(true);
            } catch (e) { toast.error('Không thể mở camera: ' + e.message); }
        }
    };

    /* ── Background audio sync ── */
    useEffect(() => {
        if (bgAudioRef.current) bgAudioRef.current.volume = bgVolume;
    }, [bgVolume]);

    /* ── Canvas overlay (captions + stickers) ── */
    useEffect(() => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (!canvas || !video) return;

        const render = () => {
            const ctx = canvas.getContext('2d');
            canvas.width = video.videoWidth || 1280;
            canvas.height = video.videoHeight || 720;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw visible captions
            captions.filter(c => currentTime >= c.startTime && currentTime <= c.endTime).forEach(cap => {
                ctx.font = `bold ${cap.size}px ${cap.font}`;
                const x = (cap.x / 100) * canvas.width;
                const y = (cap.y / 100) * canvas.height;
                const tw = ctx.measureText(cap.text).width;
                const th = cap.size;
                ctx.fillStyle = cap.bg;
                ctx.fillRect(x - tw / 2 - 8, y - th - 4, tw + 16, th + 12);
                ctx.fillStyle = cap.color;
                ctx.textAlign = 'center';
                ctx.fillText(cap.text, x, y);
            });

            // Draw stickers
            stickers.filter(s => currentTime >= s.startTime && currentTime <= s.endTime).forEach(s => {
                ctx.font = `${s.size}px serif`;
                ctx.textAlign = 'center';
                ctx.fillText(s.emoji, (s.x / 100) * canvas.width, (s.y / 100) * canvas.height);
            });

            animFrameRef.current = requestAnimationFrame(render);
        };
        animFrameRef.current = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animFrameRef.current);
    }, [captions, stickers, currentTime]);

    /* ── Speed ── */
    useEffect(() => {
        if (videoRef.current) videoRef.current.playbackRate = speed;
    }, [speed]);

    /* ── Volume ── */
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = volume;
            videoRef.current.muted = muted;
        }
    }, [volume, muted]);

    /* ── Play/Pause ── */
    const togglePlay = () => {
        const v = videoRef.current;
        if (!v) return;
        if (v.paused) {
            if (v.currentTime >= trimEnd) v.currentTime = trimStart;
            v.play();
        } else {
            v.pause();
        }
    };

    /* ── Seek ── */
    const seekTo = (pct) => {
        const t = pct * duration;
        if (videoRef.current) videoRef.current.currentTime = t;
    };

    /* ── Timeline drag ── */
    const handleTimelineMouse = useCallback((e) => {
        if (!dragging || !timelineRef.current || !duration) return;
        const rect = timelineRef.current.getBoundingClientRect();
        const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const t = pct * duration;
        if (dragging === 'start') {
            setTrimStart(Math.min(t, trimEnd - 0.5));
        } else if (dragging === 'end') {
            setTrimEnd(Math.max(t, trimStart + 0.5));
        } else if (dragging === 'seek') {
            if (videoRef.current) videoRef.current.currentTime = t;
        }
    }, [dragging, duration, trimStart, trimEnd]);

    const handleTimelineMouseUp = useCallback(() => setDragging(null), []);

    useEffect(() => {
        window.addEventListener('mousemove', handleTimelineMouse);
        window.addEventListener('mouseup', handleTimelineMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleTimelineMouse);
            window.removeEventListener('mouseup', handleTimelineMouseUp);
        };
    }, [handleTimelineMouse, handleTimelineMouseUp]);

    /* ── Add Caption ── */
    const addCaption = () => {
        if (!captionText.trim()) return;
        const cap = {
            id: Date.now(),
            text: captionText,
            font: captionFont,
            size: captionSize,
            color: captionColor,
            bg: captionBg,
            x: captionX,
            y: captionY,
            startTime: currentTime,
            endTime: Math.min(currentTime + 3, duration),
        };
        setCaptions(prev => [...prev, cap]);
        setCaptionText('');
    };

    const removeCaption = (id) => setCaptions(prev => prev.filter(c => c.id !== id));

    /* ── Add Cut Segment ── */
    const addCut = () => {
        const start = trimStart;
        const end = trimEnd;
        setCuts(prev => [...prev, { id: Date.now(), start, end, label: `Clip ${prev.length + 1}` }]);
        setCutMode(false);
    };

    /* ── FFmpeg: Render ── */
    const handleRender = async () => {
        if (!ffmpegLoaded || !videoFile || processing) return;
        setProcessing(true);
        setProcessProgress(0);
        setProcessLog('🚀 Bắt đầu render...');
        setOutputUrl(null);

        const ffmpeg = ffmpegRef.current;
        try {
            await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile));

            const filterStr = FILTERS[filterIdx].css ? buildVfFilter(filterIdx) : null;
            const args = ['-i', 'input.mp4'];

            // Trim
            if (trimStart > 0 || trimEnd < duration) {
                args.push('-ss', String(trimStart.toFixed(3)));
                args.push('-to', String(trimEnd.toFixed(3)));
            }

            // Speed
            if (speed !== 1) {
                const vSetpts = `setpts=${(1 / speed).toFixed(3)}*PTS`;
                const atempo = speed > 2
                    ? `atempo=2.0,atempo=${(speed / 2).toFixed(3)}`
                    : speed < 0.5
                        ? `atempo=0.5,atempo=${(speed * 2).toFixed(3)}`
                        : `atempo=${speed.toFixed(3)}`;
                args.push('-filter_complex', `[0:v]${vSetpts}${filterStr ? `,${filterStr}` : ''}[v];[0:a]${atempo}[a]`);
                args.push('-map', '[v]', '-map', '[a]');
            } else if (filterStr) {
                args.push('-vf', filterStr);
            }

            // Volume
            if (!muted && volume !== 1) {
                args.push('-af', `volume=${volume.toFixed(2)}`);
            }
            if (muted) args.push('-an');

            args.push('-c:v', 'libx264', '-preset', 'fast', '-crf', '23', '-c:a', 'aac', 'output.mp4');

            setProcessLog('⚙️ Đang xử lý video...');
            await ffmpeg.exec(args);

            const data = await ffmpeg.readFile('output.mp4');
            const blob = new Blob([data.buffer], { type: 'video/mp4' });
            const url = URL.createObjectURL(blob);
            setOutputUrl(url);
            setProcessLog('✅ Render xong! Nhấn tải về để lưu.');
        } catch (err) {
            setProcessLog('❌ Lỗi: ' + err.message);
        } finally {
            setProcessing(false);
            setProcessProgress(100);
        }
    };

    const buildVfFilter = (idx) => {
        const filters = ['', 'eq=brightness=0.1:contrast=1.1:saturation=1', 'eq=brightness=-0.15:contrast=1.2', 'hue=s=0', 'colortemperature=temperature=6500', 'hue=h=180', 'eq=saturation=0.6:brightness=-0.05:contrast=1.1', 'eq=saturation=2:contrast=1.2'];
        return filters[idx] || '';
    };

    /* ── Upload to backend ── */
    const handleUpload = async () => {
        if (!outputUrl || uploading) return;
        setUploading(true);
        try {
            const res = await fetch(outputUrl);
            const blob = await res.blob();
            const formData = new FormData();
            formData.append('file', blob, videoFile?.name || 'video.mp4');
            const uploadRes = await fetch('http://localhost:5000/api/uploads/submission', {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });
            if (!uploadRes.ok) throw new Error('Upload thất bại');
            const { url } = await uploadRes.json();
            setUploadedUrl(url);
            if (onSubmissionReady) onSubmissionReady(url);
        } catch (err) {
            toast.error('Lỗi upload: ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    const pct = (t) => duration ? ((t / duration) * 100).toFixed(2) + '%' : '0%';
    const isLoaded = !!videoUrl;

    /* ─────────────────── RENDER ─────────────────── */
    return (
        <div className="flex flex-col gap-4 select-none">
            {/* Upload */}
            {!isLoaded ? (
                <label className="cursor-pointer block">
                    <div className="border-2 border-dashed border-gray-700 hover:border-blue-500 rounded-2xl p-12 text-center transition-all bg-gray-900">
                        <div className="text-5xl mb-3">🎬</div>
                        <p className="text-gray-300 font-semibold text-lg mb-1">Upload video để bắt đầu chỉnh sửa</p>
                        <p className="text-gray-600 text-sm">MP4, MOV, AVI, MKV, WebM...</p>
                    </div>
                    <input type="file" accept="video/*" onChange={handleFileLoad} className="hidden" />
                </label>
            ) : (
                <>
                {/* ─── PREVIEW PLAYER ─── */}
                <div className="bg-black rounded-2xl overflow-hidden relative" style={{ aspectRatio: '16/9' }}>
                    <video
                        ref={videoRef}
                        src={videoUrl}
                        className="w-full h-full object-contain"
                        style={{ filter: computedFilter(), transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})` }}
                        onClick={togglePlay}
                    />
                    {/* Caption + Sticker Canvas */}
                    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.99 }} />
                    {/* PiP Camera */}
                    {pipActive && (
                        <video ref={pipVideoRef} muted playsInline autoPlay
                            className="absolute w-1/4 rounded-xl border-2 border-white shadow-lg object-cover"
                            style={{ top: pipPos.y + '%', left: pipPos.x + '%' }} />
                    )}
                    {!isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                            </div>
                        </div>
                    )}
                    <div className="absolute bottom-2 right-3 bg-black/60 text-white text-xs font-mono px-2 py-1 rounded">{fmt(currentTime)} / {fmt(duration)}</div>
                    <label className="absolute top-2 right-2 cursor-pointer">
                        <div className="bg-black/60 hover:bg-black text-white text-xs px-2 py-1 rounded-lg transition-colors">🔄 Đổi video</div>
                        <input type="file" accept="video/*" onChange={handleFileLoad} className="hidden" />
                    </label>
                </div>

                {/* ─── TIMELINE ─── */}
                <div className="bg-gray-900 rounded-xl p-4 space-y-3">
                    {/* Controls row */}
                    <div className="flex items-center gap-3">
                        <button onClick={togglePlay}
                            className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-white transition-all shrink-0">
                            {isPlaying
                                ? <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6zm8 0h4v16h-4z"/></svg>
                                : <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                            }
                        </button>
                        {/* Seek to start */}
                        <button onClick={() => videoRef.current && (videoRef.current.currentTime = trimStart)}
                            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-800">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                        </button>
                        <span className="font-mono text-sm text-gray-300">{fmt(currentTime)}</span>
                        <div className="flex-1" />
                        {/* Speed */}
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs text-gray-500">Speed</span>
                            <select value={speed} onChange={e => setSpeed(Number(e.target.value))}
                                className="bg-gray-800 border border-gray-700 text-white text-xs rounded-lg px-2 py-1">
                                {SPEEDS.map(s => <option key={s} value={s}>{s}x</option>)}
                            </select>
                        </div>
                        {/* Volume */}
                        <div className="flex items-center gap-1.5">
                            <button onClick={() => setMuted(!muted)} className="text-gray-400 hover:text-white">
                                {muted ? '🔇' : '🔊'}
                            </button>
                            <input type="range" min={0} max={1} step={0.05} value={volume}
                                onChange={e => setVolume(Number(e.target.value))}
                                className="w-16 accent-blue-500" />
                        </div>
                    </div>

                    {/* Timeline bar */}
                    <div className="relative h-14 flex items-center" ref={timelineRef}
                        onMouseDown={(e) => {
                            const rect = timelineRef.current.getBoundingClientRect();
                            const pct = (e.clientX - rect.left) / rect.width;
                            const t = pct * duration;
                            if (videoRef.current) videoRef.current.currentTime = t;
                            setDragging('seek');
                        }}>
                        {/* Track BG */}
                        <div className="absolute inset-x-0 top-4 h-6 bg-gray-700 rounded-full cursor-pointer" />

                        {/* Trim region */}
                        <div className="absolute top-4 h-6 bg-blue-500/30 border-t-2 border-b-2 border-blue-500 rounded"
                            style={{ left: pct(trimStart), width: `calc(${pct(trimEnd)} - ${pct(trimStart)})` }} />

                        {/* Cut segments */}
                        {cuts.map(cut => (
                            <div key={cut.id} className="absolute top-3.5 h-7 bg-green-500/30 border border-green-500 rounded pointer-events-none"
                                style={{ left: pct(cut.start), width: `calc(${pct(cut.end)} - ${pct(cut.start)})` }}>
                                <span className="text-green-400 text-xs px-1 truncate">{cut.label}</span>
                            </div>
                        ))}

                        {/* Playhead */}
                        <div className="absolute top-2 w-0.5 h-10 bg-white z-10 pointer-events-none"
                            style={{ left: pct(currentTime) }}>
                            <div className="w-3 h-3 bg-white rounded-full -ml-1.5 -mt-1" />
                        </div>

                        {/* Trim handle: start */}
                        <div className="absolute top-1 h-12 w-3 bg-blue-500 rounded-l-lg cursor-ew-resize z-20 flex items-center justify-center"
                            style={{ left: `calc(${pct(trimStart)} - 6px)` }}
                            onMouseDown={(e) => { e.stopPropagation(); setDragging('start'); }}>
                            <div className="w-0.5 h-6 bg-white/70 rounded" />
                        </div>

                        {/* Trim handle: end */}
                        <div className="absolute top-1 h-12 w-3 bg-blue-500 rounded-r-lg cursor-ew-resize z-20 flex items-center justify-center"
                            style={{ left: `calc(${pct(trimEnd)} - 6px)` }}
                            onMouseDown={(e) => { e.stopPropagation(); setDragging('end'); }}>
                            <div className="w-0.5 h-6 bg-white/70 rounded" />
                        </div>
                    </div>

                    {/* Trim info */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>✂️ Từ <strong className="text-blue-400">{fmt(trimStart)}</strong> → <strong className="text-blue-400">{fmt(trimEnd)}</strong> ({fmt(trimEnd - trimStart)})</span>
                        <button onClick={() => { setTrimStart(0); setTrimEnd(duration); }} className="text-gray-600 hover:text-gray-400">Reset trim</button>
                    </div>
                </div>

                {/* ─── PANELS ─── */}
                <div className="flex gap-2 flex-wrap">
                    {[['trim','✂️ Cắt'], ['caption','💬 Caption'], ['filters','🎨 Filter'], ['color','🌈 Màu'], ['transform','🔄 Xoay'], ['stickers','😂 Sticker'], ['pip','📷 Camera'], ['bgaudio','🎵 Nhạc nền'], ['cuts','📌 Clips'], ['audio','🔊 Âm lượng'], ['export','🚀 Export']].map(([p, l]) => (
                        <button key={p} onClick={() => setActivePanel(p)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${activePanel === p ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'}`}>
                            {l}
                        </button>
                    ))}
                </div>

                {/* PANEL: Trim */}
                {activePanel === 'trim' && (
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
                        <h4 className="font-bold text-gray-200">✂️ Cắt / Trim video</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs text-gray-400 block mb-1">Điểm bắt đầu (giây)</label>
                                <input type="number" min={0} max={trimEnd - 0.1} step={0.1} value={trimStart.toFixed(1)}
                                    onChange={e => setTrimStart(Math.min(Number(e.target.value), trimEnd - 0.5))}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm font-mono" />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 block mb-1">Điểm kết thúc (giây)</label>
                                <input type="number" min={trimStart + 0.1} max={duration} step={0.1} value={trimEnd.toFixed(1)}
                                    onChange={e => setTrimEnd(Math.max(Number(e.target.value), trimStart + 0.5))}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm font-mono" />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => { if (videoRef.current) setTrimStart(videoRef.current.currentTime); }}
                                className="flex-1 py-2 bg-gray-800 border border-gray-700 text-sm text-gray-300 hover:text-white rounded-lg">
                                📍 Đặt điểm đầu tại đây
                            </button>
                            <button onClick={() => { if (videoRef.current) setTrimEnd(videoRef.current.currentTime); }}
                                className="flex-1 py-2 bg-gray-800 border border-gray-700 text-sm text-gray-300 hover:text-white rounded-lg">
                                📍 Đặt điểm cuối tại đây
                            </button>
                        </div>
                        <p className="text-xs text-gray-600">💡 Kéo thanh xanh trên timeline, hoặc bấm nút để đặt điểm cắt tại vị trí hiện tại</p>
                    </div>
                )}

                {/* PANEL: Caption */}
                {activePanel === 'caption' && (
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-4">
                        <h4 className="font-bold text-gray-200">💬 Thêm Caption / Chữ</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-2">
                                <input value={captionText} onChange={e => setCaptionText(e.target.value)}
                                    placeholder="Nhập nội dung caption..."
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm" />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Font</label>
                                <select value={captionFont} onChange={e => setCaptionFont(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-2 py-1.5">
                                    {FONTS.map(f => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Cỡ chữ: {captionSize}px</label>
                                <input type="range" min={16} max={96} value={captionSize} onChange={e => setCaptionSize(Number(e.target.value))}
                                    className="w-full accent-blue-500" />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Màu chữ</label>
                                <input type="color" value={captionColor} onChange={e => setCaptionColor(e.target.value)}
                                    className="w-full h-10 rounded-lg cursor-pointer bg-gray-800 border border-gray-700 px-1" />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Vị trí ngang: {captionX}%</label>
                                <input type="range" min={0} max={100} value={captionX} onChange={e => setCaptionX(Number(e.target.value))}
                                    className="w-full accent-blue-500" />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Vị trí dọc: {captionY}%</label>
                                <input type="range" min={0} max={100} value={captionY} onChange={e => setCaptionY(Number(e.target.value))}
                                    className="w-full accent-blue-500" />
                            </div>
                        </div>
                        <button onClick={addCaption} disabled={!captionText.trim()}
                            className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm disabled:opacity-40">
                            + Thêm tại {fmt(currentTime)}
                        </button>

                        {/* Caption list */}
                        {captions.length > 0 && (
                            <div className="space-y-2 max-h-44 overflow-y-auto">
                                {captions.map(c => (
                                    <div key={c.id} className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2">
                                        <span className="text-xs font-mono text-gray-500">{fmt(c.startTime)}→{fmt(c.endTime)}</span>
                                        <span className="flex-1 text-sm text-white truncate">{c.text}</span>
                                        <input type="number" min={0} max={duration} step={0.5} value={c.endTime.toFixed(1)}
                                            onChange={e => setCaptions(prev => prev.map(cap => cap.id === c.id ? { ...cap, endTime: Number(e.target.value) } : cap))}
                                            className="w-20 bg-gray-700 border border-gray-600 rounded px-1 py-0.5 text-white text-xs font-mono" />
                                        <button onClick={() => removeCaption(c.id)} className="text-red-400 hover:text-red-300 text-lg leading-none">×</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* PANEL: Filters */}
                {activePanel === 'filters' && (
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                        <h4 className="font-bold text-gray-200 mb-3">🎨 Bộ lọc nhanh</h4>
                        <div className="grid grid-cols-4 gap-2">
                            {FILTERS.map((f, i) => (
                                <button key={i} onClick={() => setFilterIdx(i)}
                                    className={`p-2 rounded-xl border-2 text-xs font-semibold transition-all ${filterIdx === i ? 'border-blue-500 bg-blue-600/20 text-blue-400' : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500'}`}>
                                    <div className="w-full h-8 rounded mb-1 bg-gradient-to-r from-gray-600 to-gray-400" style={{ filter: f.css }} />
                                    {f.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* PANEL: Color Grading */}
                {activePanel === 'color' && (
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="font-bold text-gray-200">🌈 Chỉnh màu sắc</h4>
                            <button onClick={() => { setBrightness(100); setContrast(100); setSaturation(100); setHue(0); setBlur(0); }} className="text-xs text-gray-500 hover:text-gray-300">Reset</button>
                        </div>
                        {[['Độ sáng', brightness, setBrightness, 0, 200, '%'],['Tương phản', contrast, setContrast, 0, 200, '%'],['Bão hoà', saturation, setSaturation, 0, 200, '%'],['Tông màu', hue, setHue, -180, 180, '°'],['Làm mờ', blur, setBlur, 0, 10, 'px']].map(([lbl, val, set, min, max, unit]) => (
                            <div key={lbl}>
                                <div className="flex justify-between text-xs text-gray-400 mb-1"><span>{lbl}</span><span className="font-mono text-white">{val}{unit}</span></div>
                                <input type="range" min={min} max={max} value={val} onChange={e => set(Number(e.target.value))} className="w-full accent-blue-500" />
                            </div>
                        ))}
                    </div>
                )}

                {/* PANEL: Transform */}
                {activePanel === 'transform' && (
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-4">
                        <h4 className="font-bold text-gray-200">🔄 Xoay & Lật</h4>
                        <div className="grid grid-cols-4 gap-2">
                            {[0,90,180,270].map(r => (
                                <button key={r} onClick={() => setRotation(r)}
                                    className={`py-3 rounded-xl border-2 text-sm font-bold transition-all ${rotation === r ? 'border-blue-500 bg-blue-600/20 text-blue-400' : 'border-gray-700 bg-gray-800 text-gray-400'}`}>
                                    {r}°
                                </button>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => setFlipH(!flipH)} className={`py-3 rounded-xl border-2 font-semibold text-sm transition-all ${flipH ? 'border-blue-500 bg-blue-600/20 text-blue-400' : 'border-gray-700 bg-gray-800 text-gray-400'}`}>↔️ Lật ngang</button>
                            <button onClick={() => setFlipV(!flipV)} className={`py-3 rounded-xl border-2 font-semibold text-sm transition-all ${flipV ? 'border-blue-500 bg-blue-600/20 text-blue-400' : 'border-gray-700 bg-gray-800 text-gray-400'}`}>↕️ Lật dọc</button>
                        </div>
                        <button onClick={() => { setRotation(0); setFlipH(false); setFlipV(false); }} className="w-full py-2 text-xs text-gray-500 hover:text-gray-300 border border-gray-700 rounded-xl">Reset transform</button>
                    </div>
                )}

                {/* PANEL: Stickers */}
                {activePanel === 'stickers' && (
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
                        <h4 className="font-bold text-gray-200">😂 Sticker / Emoji</h4>
                        <p className="text-xs text-gray-500">Bấm vào emoji để thêm vào vị trí hiện tại ({fmt(currentTime)})</p>
                        <div className="flex flex-wrap gap-2">
                            {EMOJI_LIST.map(em => (
                                <button key={em} onClick={() => setStickers(prev => [...prev, { id: Date.now(), emoji: em, x: 50, y: 50, size: 64, startTime: currentTime, endTime: Math.min(currentTime + 3, duration) }])}
                                    className="text-3xl w-12 h-12 bg-gray-800 rounded-xl hover:bg-gray-700 border border-gray-700 hover:border-blue-500 transition-all flex items-center justify-center">{em}</button>
                            ))}
                        </div>
                        {stickers.length > 0 && (
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {stickers.map(s => (
                                    <div key={s.id} className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2">
                                        <span className="text-2xl">{s.emoji}</span>
                                        <div className="flex-1 grid grid-cols-2 gap-1 text-xs">
                                            <div><label className="text-gray-500">X%</label><input type="number" min={0} max={100} value={s.x} onChange={e => setStickers(prev => prev.map(st => st.id===s.id?{...st,x:+e.target.value}:st))} className="w-full bg-gray-700 rounded px-1 text-white"/></div>
                                            <div><label className="text-gray-500">Y%</label><input type="number" min={0} max={100} value={s.y} onChange={e => setStickers(prev => prev.map(st => st.id===s.id?{...st,y:+e.target.value}:st))} className="w-full bg-gray-700 rounded px-1 text-white"/></div>
                                            <div><label className="text-gray-500">Đến (s)</label><input type="number" min={0} max={duration} step={0.5} value={s.endTime.toFixed(1)} onChange={e => setStickers(prev => prev.map(st => st.id===s.id?{...st,endTime:+e.target.value}:st))} className="w-full bg-gray-700 rounded px-1 text-white"/></div>
                                            <div><label className="text-gray-500">Size</label><input type="number" min={20} max={200} value={s.size} onChange={e => setStickers(prev => prev.map(st => st.id===s.id?{...st,size:+e.target.value}:st))} className="w-full bg-gray-700 rounded px-1 text-white"/></div>
                                        </div>
                                        <button onClick={() => setStickers(prev => prev.filter(st => st.id !== s.id))} className="text-red-400 text-lg">×</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* PANEL: PiP Camera */}
                {activePanel === 'pip' && (
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-4">
                        <h4 className="font-bold text-gray-200">📷 Camera góc (Picture-in-Picture)</h4>
                        <button onClick={togglePip} className={`w-full py-3 font-bold rounded-xl text-sm transition-all ${pipActive ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}>
                            {pipActive ? '⏹ Tắt camera' : '📷 Bật camera góc'}
                        </button>
                        {pipActive && (
                            <div className="space-y-3">
                                <p className="text-xs text-green-400">🟢 Camera đang bật — hiển thị góc trên phải video</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div><label className="text-xs text-gray-400 block mb-1">Vị trí ngang: {pipPos.x}%</label><input type="range" min={0} max={75} value={pipPos.x} onChange={e => setPipPos(p => ({...p, x: +e.target.value}))} className="w-full accent-blue-500" /></div>
                                    <div><label className="text-xs text-gray-400 block mb-1">Vị trí dọc: {pipPos.y}%</label><input type="range" min={0} max={75} value={pipPos.y} onChange={e => setPipPos(p => ({...p, y: +e.target.value}))} className="w-full accent-blue-500" /></div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* PANEL: Background Audio */}
                {activePanel === 'bgaudio' && (
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-4">
                        <h4 className="font-bold text-gray-200">🎵 Nhạc nền</h4>
                        <label className="block cursor-pointer">
                            <div className="border-2 border-dashed border-gray-700 hover:border-blue-500 rounded-xl p-4 text-center transition-colors">
                                <p className="text-gray-400 text-sm">{bgAudioFile ? `🎵 ${bgAudioFile.name}` : 'Chọn file nhạc nền (MP3, WAV, OGG...)'}</p>
                            </div>
                            <input type="file" accept="audio/*" onChange={e => { const f = e.target.files?.[0]; if(f){ setBgAudioFile(f); setBgAudioUrl(URL.createObjectURL(f)); }}} className="hidden" />
                        </label>
                        {bgAudioUrl && (
                            <div className="space-y-3">
                                <audio ref={bgAudioRef} src={bgAudioUrl} loop controls className="w-full" />
                                <div><label className="text-xs text-gray-400 block mb-1">Âm lượng nhạc nền: {Math.round(bgVolume*100)}%</label><input type="range" min={0} max={1} step={0.05} value={bgVolume} onChange={e => setBgVolume(+e.target.value)} className="w-full accent-blue-500" /></div>
                                <p className="text-xs text-gray-600">💡 Nhạc nền phát cùng video khi xem. Khi export FFmpeg, upload nhạc lên và chán mình sẽ add vào render pipeline.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* PANEL: Clips / Cuts */}
                {activePanel === 'cuts' && (
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
                        <h4 className="font-bold text-gray-200">📌 Đánh dấu Clips</h4>
                        <div className="flex items-center gap-3">
                            <div>
                                <p className="text-xs text-gray-500 mb-0.5">Điểm đầu: <strong className="text-white font-mono">{fmt(trimStart)}</strong></p>
                                <p className="text-xs text-gray-500">Điểm cuối: <strong className="text-white font-mono">{fmt(trimEnd)}</strong></p>
                            </div>
                            <button onClick={addCut}
                                className="flex-1 py-2 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl text-sm">
                                + Lưu clip này
                            </button>
                        </div>
                        <p className="text-xs text-gray-600">Dùng trim để chọn đoạn muốn giữ rồi bấm "Lưu clip này". Khi export có thể render từng clip.</p>
                        {cuts.length > 0 && (
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {cuts.map(cut => (
                                    <div key={cut.id} className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2">
                                        <span className="text-green-400 text-xs">🎞️</span>
                                        <input value={cut.label} onChange={e => setCuts(prev => prev.map(c => c.id === cut.id ? { ...c, label: e.target.value } : c))}
                                            className="flex-1 bg-transparent text-white text-sm border-b border-gray-700 focus:border-blue-500 outline-none" />
                                        <span className="text-xs text-gray-500 font-mono">{fmt(cut.start)} → {fmt(cut.end)}</span>
                                        <button onClick={() => { setTrimStart(cut.start); setTrimEnd(cut.end); if (videoRef.current) videoRef.current.currentTime = cut.start; }}
                                            className="text-blue-400 hover:text-blue-300 text-xs">Preview</button>
                                        <button onClick={() => setCuts(prev => prev.filter(c => c.id !== cut.id))} className="text-red-400 text-lg leading-none">×</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* PANEL: Audio */}
                {activePanel === 'audio' && (
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-4">
                        <h4 className="font-bold text-gray-200">🔊 Âm thanh</h4>
                        <div className="flex items-center gap-4">
                            <button onClick={() => setMuted(!muted)} className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${muted ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 border border-gray-700'}`}>
                                {muted ? '🔇 Tắt tiếng' : '🔊 Có tiếng'}
                            </button>
                        </div>
                        <div>
                            <label className="text-sm text-gray-400 block mb-2">Âm lượng: {Math.round(volume * 100)}%</label>
                            <input type="range" min={0} max={2} step={0.05} value={volume} onChange={e => setVolume(Number(e.target.value))}
                                className="w-full accent-blue-500" />
                            <p className="text-xs text-gray-600 mt-1">Có thể tăng lên 200% để khuếch đại âm thanh</p>
                        </div>
                    </div>
                )}

                {/* PANEL: Export */}
                {activePanel === 'export' && (
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-4">
                        <h4 className="font-bold text-gray-200">🚀 Xuất video (FFmpeg)</h4>

                        {!ffmpegLoaded ? (
                            <div className="space-y-3">
                                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-sm text-yellow-300">
                                    ⚠️ FFmpeg chưa tải. Nhấn nút dưới để tải (~30MB, chỉ tải 1 lần).
                                </div>
                                <button onClick={loadFFmpeg} disabled={ffmpegLoading}
                                    className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
                                    {ffmpegLoading
                                        ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Đang tải FFmpeg...</>
                                        : '⬇️ Tải FFmpeg để render video'}
                                </button>
                                {processLog && <p className="text-xs text-gray-500 font-mono">{processLog}</p>}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="text-xs text-gray-500 space-y-1 bg-gray-800/50 rounded-lg p-3">
                                    <div className="flex justify-between"><span>Trim:</span><span className="text-white">{fmt(trimStart)} → {fmt(trimEnd)} ({fmt(trimEnd - trimStart)})</span></div>
                                    <div className="flex justify-between"><span>Speed:</span><span className="text-white">{speed}x</span></div>
                                    <div className="flex justify-between"><span>Filter:</span><span className="text-white">{FILTERS[filterIdx].name}</span></div>
                                    <div className="flex justify-between"><span>Âm thanh:</span><span className="text-white">{muted ? 'Tắt' : `${Math.round(volume * 100)}%`}</span></div>
                                </div>

                                {processing && (
                                    <div className="space-y-2">
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${processProgress}%` }} />
                                        </div>
                                        <p className="text-xs text-gray-400 font-mono">{processLog}</p>
                                    </div>
                                )}

                                {!processing && processLog && (
                                    <p className="text-xs text-gray-400 font-mono bg-gray-800 rounded-lg p-2">{processLog}</p>
                                )}

                                <button onClick={handleRender} disabled={processing}
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
                                    {processing
                                        ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Đang render...</>
                                        : '🎬 Render & Xuất MP4'}
                                </button>

                                {outputUrl && (
                                    <div className="space-y-2">
                                        <p className="text-green-400 text-sm font-semibold">✅ Video đã render!</p>
                                        <video src={outputUrl} controls className="w-full rounded-xl bg-black max-h-40" />
                                        <a href={outputUrl} download={`edited_${videoFile?.name || 'video.mp4'}`}
                                            className="block w-full py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl text-center text-sm">
                                            ⬇️ Tải về máy
                                        </a>
                                        {/* Auto Upload & Get Link */}
                                        {uploadedUrl ? (
                                            <div className="p-3 bg-green-900/20 border border-green-700/40 rounded-xl space-y-2">
                                                <p className="text-green-400 text-xs font-semibold">🔗 Link đã tạo:</p>
                                                <p className="text-white text-xs font-mono break-all bg-gray-800 p-2 rounded-lg">{uploadedUrl}</p>
                                                <button
                                                    onClick={() => { navigator.clipboard.writeText(uploadedUrl); }}
                                                    className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded-lg">
                                                    📋 Copy link
                                                </button>
                                                {onSubmissionReady && (
                                                    <p className="text-xs text-green-400 text-center">✅ Link đã điền vào form submit bên dưới!</p>
                                                )}
                                            </div>
                                        ) : (
                                            <button onClick={handleUpload} disabled={uploading}
                                                className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
                                                {uploading
                                                    ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Đang upload...</>
                                                    : '⬆️ Upload & Lấy link nộp'}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
                </>
            )}
        </div>
    );
};

export default VideoEditor;
