import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { contractsApi } from '../../api/contracts.api';
import { workSessionsApi } from '../../api/workSessions.api';
import { useToast } from '../../contexts/ToastContext';
import VideoEditor from './VideoEditor';

/* ─── Helpers ─── */
function formatTime(s) {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return [h, m, sec].map(v => String(v).padStart(2, '0')).join(':');
}
function formatMinutes(m) {
    if (!m) return '0m';
    const h = Math.floor(m / 60), min = Math.round(m % 60);
    return h > 0 ? `${h}h ${min}m` : `${min}m`;
}
function toSrtTime(sec) {
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = Math.floor(sec % 60), ms = Math.round((sec % 1) * 1000);
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')},${String(ms).padStart(3,'0')}`;
}

const AUTOSAVE_MS = 8000;
const TABS = ['📝 NOTES', '🎬 SCREEN RECORD', '📤 MEDIA', '💬 SUBTITLES', '✂️ EDIT'];

const CheckpointWorkspace = () => {
    const { checkpointId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const STORAGE_KEY = `wsd_${checkpointId}`;

    /* ── State ── */
    const [checkpoint, setCheckpoint] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [totalMinutes, setTotalMinutes] = useState(0);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [elapsed, setElapsed] = useState(0);
    const [activeTab, setActiveTab] = useState(0);
    const [lastSaved, setLastSaved] = useState(null);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitFile, setSubmitFile] = useState(null);
    const [submitProgress, setSubmitProgress] = useState(0);

    /* Draft state */
    const [notes, setNotes] = useState('');
    const [submissionUrl, setSubmissionUrl] = useState('');
    const [subtitles, setSubtitles] = useState([{ id: 1, start: 0, end: 3, text: '' }]);

    /* Screen recorder */
    const [isRecording, setIsRecording] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [recordedUrl, setRecordedUrl] = useState(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const [recordMode, setRecordMode] = useState('screen');
    const mediaRecorderRef = useRef(null);
    const recordTimerRef = useRef(null);
    const liveVideoRef = useRef(null);

    /* Video upload */
    const [uploadedVideos, setUploadedVideos] = useState([]);
    const [activeVideo, setActiveVideo] = useState(null);
    const videoPlayerRef = useRef(null);
    const [currentVideoTime, setCurrentVideoTime] = useState(0);

    /* Refs for cleanup */
    const timerRef = useRef(null);
    const sessionRef = useRef(null);
    const notesRef = useRef('');
    const urlRef = useRef('');
    const subsRef = useRef([]);
    useEffect(() => { notesRef.current = notes; }, [notes]);
    useEffect(() => { urlRef.current = submissionUrl; }, [submissionUrl]);
    useEffect(() => { subsRef.current = subtitles; }, [subtitles]);

    /* ── Draft save / load ── */
    const saveDraft = useCallback(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                notes: notesRef.current, url: urlRef.current,
                subtitles: subsRef.current, savedAt: new Date().toISOString()
            }));
            setLastSaved(new Date());
        } catch {}
    }, [STORAGE_KEY]);

    const loadDraft = useCallback(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const d = JSON.parse(raw);
                if (d.notes) setNotes(d.notes);
                if (d.url) setSubmissionUrl(d.url);
                if (d.subtitles?.length) setSubtitles(d.subtitles);
                if (d.savedAt) setLastSaved(new Date(d.savedAt));
            }
        } catch {}
    }, [STORAGE_KEY]);

    /* ── Sessions ── */
    const fetchSessions = useCallback(async () => {
        try {
            const res = await workSessionsApi.getSessions(checkpointId);
            const { sessions: s, totalMinutes: tm, activeSession: as } = res.data;
            setSessions(s || []);
            setTotalMinutes(tm || 0);
            if (as) {
                sessionRef.current = as;
                setCurrentSessionId(as.id);
                setElapsed(Math.floor((Date.now() - new Date(as.check_in).getTime()) / 1000));
            } else {
                sessionRef.current = null;
                setCurrentSessionId(null);
            }
        } catch {}
    }, [checkpointId]);

    /* ── Mount: auto check-in ── */
    useEffect(() => {
        const init = async () => {
            setLoading(true);
            try {
                const allRes = await contractsApi.getMyContracts();
                for (const ct of (allRes?.data || [])) {
                    const fullRes = await contractsApi.getContractById(ct.id);
                    const cp = (fullRes?.data?.checkpoints || []).find(c => String(c.id) === String(checkpointId));
                    if (cp) { setCheckpoint({ ...cp, contract: fullRes.data }); break; }
                }
            } catch {}

            loadDraft();
            await fetchSessions();

            if (!sessionRef.current) {
                try {
                    await workSessionsApi.checkIn(checkpointId);
                    await fetchSessions();
                    toast.success('SYS_MSG: Work session initiated');
                } catch {}
            }
            setLoading(false);
        };
        init();

        const autoSave = setInterval(saveDraft, AUTOSAVE_MS);

        const onUnload = () => {
            saveDraft();
            navigator.sendBeacon?.(`/api/work-sessions/${checkpointId}/checkout`,
                new Blob([JSON.stringify({ notes: notesRef.current })], { type: 'application/json' }));
        };

        const onVisibility = async () => {
            if (document.visibilityState === 'hidden') saveDraft();
            if (document.visibilityState === 'visible') await fetchSessions();
        };

        window.addEventListener('beforeunload', onUnload);
        document.addEventListener('visibilitychange', onVisibility);

        return () => {
            window.removeEventListener('beforeunload', onUnload);
            document.removeEventListener('visibilitychange', onVisibility);
            clearInterval(autoSave);
            saveDraft();
            if (sessionRef.current) workSessionsApi.checkOut(checkpointId, notesRef.current).catch(() => {});
        };
    }, [checkpointId, fetchSessions, loadDraft, saveDraft, toast]);

    /* Timer tick */
    useEffect(() => {
        if (currentSessionId) {
            timerRef.current = setInterval(() => setElapsed(p => p + 1), 1000);
        } else clearInterval(timerRef.current);
        return () => clearInterval(timerRef.current);
    }, [currentSessionId]);

    /* ── Screen Recorder ── */
    const startRecording = async () => {
        try {
            let stream;
            if (recordMode === 'screen') {
                stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
            } else if (recordMode === 'camera') {
                stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            } else {
                const screen = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
                const cam = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                stream = new MediaStream([...screen.getTracks(), ...cam.getAudioTracks()]);
            }

            if (liveVideoRef.current) {
                liveVideoRef.current.srcObject = stream;
                liveVideoRef.current.play();
            }

            const chunks = [];
            const mr = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9,opus' });
            mr.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
            mr.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                setRecordedUrl(url);
                setRecordedChunks(chunks);
                stream.getTracks().forEach(t => t.stop());
                if (liveVideoRef.current) liveVideoRef.current.srcObject = null;
                clearInterval(recordTimerRef.current);
            };

            mr.start(1000);
            mediaRecorderRef.current = mr;
            setIsRecording(true);
            setRecordingTime(0);
            setRecordedUrl(null);
            recordTimerRef.current = setInterval(() => setRecordingTime(p => p + 1), 1000);
        } catch (err) {
            toast.error('Record fail: ' + err.message);
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
    };

    const downloadRecording = () => {
        if (!recordedUrl) return;
        const a = document.createElement('a');
        a.href = recordedUrl;
        a.download = `mission_log_${checkpointId}_${Date.now()}.webm`;
        a.click();
    };

    /* ── Video Upload ── */
    const handleVideoUpload = (e) => {
        const files = Array.from(e.target.files);
        const newVideos = files.map(f => ({
            id: Date.now() + Math.random(),
            name: f.name,
            url: URL.createObjectURL(f),
            size: (f.size / 1024 / 1024).toFixed(1) + ' MB',
        }));
        setUploadedVideos(prev => [...prev, ...newVideos]);
        if (!activeVideo && newVideos.length) setActiveVideo(newVideos[0]);
    };

    /* ── Subtitle helpers ── */
    const addSubtitle = () => {
        const last = subtitles[subtitles.length - 1];
        setSubtitles(prev => [...prev, { id: Date.now(), start: last.end, end: last.end + 3, text: '' }]);
    };
    const updateSub = (id, field, val) => setSubtitles(prev => prev.map(s => s.id === id ? { ...s, [field]: field === 'text' ? val : Number(val) } : s));
    const removeSub = (id) => setSubtitles(prev => prev.filter(s => s.id !== id));
    const exportSrt = () => {
        const content = subtitles.map((s, i) => `${i + 1}\n${toSrtTime(s.start)} --> ${toSrtTime(s.end)}\n${s.text}\n`).join('\n');
        const blob = new Blob([content], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `log_subs_${checkpointId}.srt`;
        a.click();
    };
    const stampTime = () => {
        if (!videoPlayerRef.current) return;
        const t = videoPlayerRef.current.currentTime;
        const last = subtitles[subtitles.length - 1];
        if (last && !last.text) {
            updateSub(last.id, 'start', t);
            updateSub(last.id, 'end', t + 3);
        } else {
            setSubtitles(prev => [...prev, { id: Date.now(), start: t, end: t + 3, text: '' }]);
        }
    };

    /* ── Submit (file upload) ── */
    const handleSubmit = async () => {
        if (!submitFile && !submissionUrl.trim()) {
            return toast.warning('Missing payload link or file.');
        }
        setSubmitting(true);
        setSubmitProgress(0);
        try {
            let finalUrl = submissionUrl.trim();
            if (submitFile) {
                const formData = new FormData();
                formData.append('file', submitFile, submitFile.name);
                const uploadRes = await fetch('http://localhost:5000/api/uploads/submission', {
                    method: 'POST', credentials: 'include', body: formData,
                });
                if (!uploadRes.ok) throw new Error('Upload failed');
                const { url } = await uploadRes.json();
                finalUrl = url;
                setSubmitProgress(60);
            }

            if (sessionRef.current) await workSessionsApi.checkOut(checkpointId, notes);
            setSubmitProgress(80);

            await contractsApi.submitCheckpoint(Number(checkpointId), {
                submission_url: finalUrl,
                submission_notes: notes,
            });
            localStorage.removeItem(STORAGE_KEY);
            toast.success('SYS: Payload submitted successfully!');
            setShowSubmitModal(false);
            setSubmitProgress(100);
            navigate(-1);
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || 'Failure');
        } finally {
            setSubmitting(false);
        }
    };

    /* ── Pause / Resume ── */
    const handlePause = async () => {
        try {
            await workSessionsApi.checkOut(checkpointId, notes);
            sessionRef.current = null; setCurrentSessionId(null); setElapsed(0);
            saveDraft(); await fetchSessions();
            toast.info('SESSION: Paused');
        } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    };
    const handleResume = async () => {
        try {
            await workSessionsApi.checkIn(checkpointId);
            await fetchSessions(); toast.success('SESSION: Active');
        } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#020617]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-cyan-400 font-mono text-[10px] tracking-widest uppercase animate-pulse">Initializing Cyber-deck...</span>
            </div>
        </div>
    );

    const isTracking = !!currentSessionId;
    const isSubmitted = checkpoint?.status === 'SUBMITTED';
    const isApproved = checkpoint?.status === 'APPROVED';
    const canWork = !isApproved;

    return (
        <div className="min-h-screen bg-[#020617] text-slate-300 font-sans relative flex flex-col">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: 'repeating-linear-gradient(0deg,rgba(0,255,255,0.008) 0px,rgba(0,255,255,0.008) 1px,transparent 1px,transparent 3px)' }} />
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px]" />
            </div>

            {/* ── TOP BAR ── */}
            <header className="relative z-30 bg-[#090e17]/80 backdrop-blur-xl border-b border-cyan-500/30 px-4 py-3 sticky top-0 shadow-[0_4px_30px_rgba(6,182,212,0.1)]">
                <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="text-cyan-500 hover:text-cyan-400 text-[10px] uppercase font-mono tracking-widest flex items-center gap-1 transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            ABORT
                        </button>
                        <div className="h-4 w-px bg-slate-700"></div>
                        <div>
                            <p className="text-[9px] text-cyan-500/70 font-mono tracking-widest uppercase">WORKSPACE_NODE</p>
                            <h1 className="text-sm font-black text-white uppercase tracking-wider truncate max-w-xs">{checkpoint?.title || `NODE_ID_${checkpointId}`}</h1>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 flex-wrap">
                        {/* Editor link */}
                        <button onClick={() => window.open('https://www.capcut.com/editor', '_blank', 'width=1400,height=900')}
                            className="bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-black px-3 py-1.5 rounded text-[10px] tracking-widest uppercase font-mono hover:bg-indigo-600/40 transition-all flex items-center gap-1.5">
                            🎬 EXTERNAL_EDITOR
                        </button>

                        <div className="text-[9px] font-mono text-cyan-500/70 uppercase tracking-widest flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                            {lastSaved ? `SYNCED_${lastSaved.toLocaleTimeString()}` : 'AUTO_SYNC:ON'}
                        </div>

                        {/* Session Timer */}
                        <div className={`flex items-center gap-2 rounded px-3 py-1.5 border font-mono font-black tracking-widest text-[11px] uppercase ${isTracking ? 'bg-emerald-900/30 border-emerald-500/40 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-slate-800/50 border-slate-700 text-slate-500'}`}>
                            {isTracking && <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shrink-0" />}
                            T_{formatTime(elapsed)}
                        </div>

                        {canWork && (
                            isTracking
                                ? <button onClick={handlePause} className="text-[10px] uppercase tracking-widest font-black font-mono text-rose-400 hover:text-white bg-rose-900/20 hover:bg-rose-900/40 border border-rose-500/30 rounded px-3 py-1.5 transition-all">⏸ SUSPEND</button>
                                : <button onClick={handleResume} className="text-[10px] uppercase tracking-widest font-black font-mono text-emerald-400 hover:text-white bg-emerald-900/20 hover:bg-emerald-900/40 border border-emerald-500/30 rounded px-3 py-1.5 transition-all">▶️ RESUME</button>
                        )}

                        <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest font-mono border ${isApproved ? 'bg-emerald-900/30 border-emerald-500/30 text-emerald-400' : isSubmitted ? 'bg-amber-900/30 border-amber-500/30 text-amber-400' : isTracking ? 'bg-cyan-900/30 border-cyan-500/30 text-cyan-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                            {isApproved ? 'VERIFIED' : isSubmitted ? 'PENDING_REVIEW' : isTracking ? 'ACTIVE_LINK' : 'IDLE'}
                        </span>
                    </div>
                </div>

                {/* Cyberpunk Tabs */}
                <div className="max-w-screen-2xl mx-auto mt-3 flex gap-1 overflow-x-auto no-scrollbar">
                    {TABS.map((t, i) => (
                        <button key={i} onClick={() => setActiveTab(i)}
                            className={`px-5 py-2 whitespace-nowrap text-[10px] font-black tracking-widest uppercase font-mono border-b-2 transition-all ${
                                activeTab === i 
                                ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300 shadow-[inset_0_-10px_20px_-10px_rgba(6,182,212,0.3)]' 
                                : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                            }`}>
                            {t}
                        </button>
                    ))}
                </div>
            </header>

            {/* ── MAIN CONTENT ── */}
            <div className="flex-1 w-full max-w-screen-2xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 relative z-10">

                {/* ── LEFT: Workspace ── */}
                <div className="min-w-0 flex flex-col gap-6">
                    {/* Mission Header */}
                    {checkpoint && (
                        <div className="rounded-2xl border p-6 flex flex-col md:flex-row md:items-start justify-between gap-5 relative overflow-hidden" 
                            style={{ background: 'linear-gradient(145deg,#0d1224,#0f172a)', borderColor: 'rgba(6,182,212,0.3)' }}>
                            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
                            <div>
                                <h2 className="text-xl font-black text-white uppercase tracking-wide mb-2">{checkpoint.title}</h2>
                                <p className="text-[13px] font-mono text-slate-400 leading-relaxed mb-3">{checkpoint.description}</p>
                                {checkpoint.due_date && (
                                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-[10px] font-mono tracking-widest uppercase">
                                        <span className="text-rose-400">DEADLINE:</span>
                                        <span className="text-slate-300">{new Date(checkpoint.due_date).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>
                            <div className="shrink-0 text-right md:border-l border-slate-700/50 md:pl-6">
                                <p className="text-[10px] font-mono font-black text-emerald-500 uppercase tracking-widest mb-1">BOUNTY_REWARD</p>
                                <p className="text-3xl font-black text-white font-mono tracking-tighter">${Number(checkpoint.amount || 0).toLocaleString()}</p>
                            </div>
                        </div>
                    )}

                    {/* Window Container */}
                    <div className="flex-1 rounded-2xl border shadow-lg bg-[#090e17]/80 backdrop-blur-md overflow-hidden flex flex-col" style={{ borderColor: 'rgba(51,65,85,0.7)' }}>
                        {/* Tab header strip */}
                        <div className="h-2 w-full bg-gradient-to-r from-cyan-600 to-indigo-600" />
                        
                        <div className="p-6 flex-1 flex flex-col min-h-[400px]">
                            {/* TAB 0: NOTES */}
                            {activeTab === 0 && (
                                <div className="flex flex-col flex-1 gap-6">
                                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                        <h3 className="text-sm font-black text-cyan-500 uppercase tracking-widest font-mono">TEXT_LOG_EDITOR</h3>
                                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">• AUTO-SYNC ENABLED</span>
                                    </div>
                                    <textarea value={notes} onChange={e => setNotes(e.target.value)}
                                        placeholder={`// Enter mission logs...\n\n> Objectives met:\n> Pending issues:\n> Comm links:`}
                                        className="w-full flex-1 min-h-[300px] bg-[#02040a] border border-slate-700/50 rounded-xl px-4 py-3 text-cyan-100 placeholder-slate-700 text-sm leading-relaxed focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 resize-none font-mono tracking-wide selection:bg-cyan-500/30" />
                                    <div>
                                        <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest font-mono block mb-2">EXTERNAL_PAYLOAD_URL</label>
                                        <input type="url" value={submissionUrl} onChange={e => setSubmissionUrl(e.target.value)}
                                            placeholder="https://cloud.node/..."
                                            className="w-full bg-[#02040a] border border-slate-700/50 rounded-xl px-4 py-3 text-indigo-200 placeholder-slate-700 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 font-mono tracking-wide" />
                                        <p className="text-[9px] text-slate-600 font-mono mt-2 uppercase tracking-widest">Supports secure drives, unlisted video streams, binary dumps.</p>
                                    </div>
                                </div>
                            )}

                            {/* TAB 1: RECORD */}
                            {activeTab === 1 && (
                                <div className="flex flex-col gap-6">
                                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                        <h3 className="text-sm font-black text-cyan-500 uppercase tracking-widest font-mono">AV_RECORDER_MODULE</h3>
                                    </div>
                                    
                                    <div className="flex gap-2 p-1 bg-[#02040a] rounded-lg border border-slate-800">
                                        {[['screen','SCREEN_CAPTURE'],['camera','OPTICAL_LENS'],['both','DUAL_STREAM']].map(([m, label]) => (
                                            <button key={m} onClick={() => setRecordMode(m)} disabled={isRecording}
                                                className={`flex-1 py-2 text-[10px] font-black uppercase font-mono tracking-widest rounded transition-all ${recordMode === m ? 'bg-slate-800 text-cyan-400 shadow' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}>
                                                {label}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="bg-[#02040a] rounded-xl overflow-hidden aspect-video relative border border-slate-800 shadow-[inset_0_0_20px_rgba(0,0,0,1)]">
                                        <video ref={liveVideoRef} muted playsInline className="w-full h-full object-contain" />
                                        {!isRecording && !recordedUrl && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 font-mono text-[10px] uppercase tracking-widest">
                                                <div className="text-4xl mb-3 opacity-20">[O]</div>
                                                <p className="animate-pulse">Awaiting input signal...</p>
                                            </div>
                                        )}
                                        {isRecording && (
                                            <div className="absolute top-4 left-4 flex items-center gap-2 bg-rose-900/80 border border-rose-500/50 px-3 py-1 rounded shadow-[0_0_10px_rgba(225,29,72,0.5)]">
                                                <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse" />
                                                <span className="text-[10px] font-black text-rose-200 font-mono uppercase tracking-widest">REC_T{formatTime(recordingTime)}</span>
                                            </div>
                                        )}
                                        {/* Scanline overlay */}
                                        <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(0deg,rgba(255,255,255,0.05) 0px,rgba(255,255,255,0.05) 1px,transparent 1px,transparent 4px)' }}></div>
                                    </div>

                                    <div className="flex gap-3">
                                        {!isRecording ? (
                                            <button onClick={startRecording}
                                                className="flex-1 py-4 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/50 text-rose-400 font-black font-mono text-[11px] uppercase tracking-widest rounded-xl transition-all shadow-[0_0_15px_rgba(225,29,72,0.2)] hover:shadow-[0_0_20px_rgba(225,29,72,0.4)]">
                                                [ INIT_RECORDING ]
                                            </button>
                                        ) : (
                                            <button onClick={stopRecording}
                                                className="flex-1 py-4 bg-slate-800 border border-slate-600 text-white font-black font-mono text-[11px] uppercase tracking-widest rounded-xl transition-all hover:bg-slate-700">
                                                [ TERMINATE_RECORDING ]
                                            </button>
                                        )}
                                    </div>

                                    {recordedUrl && (
                                        <div className="border border-emerald-500/30 bg-emerald-900/10 rounded-xl p-5 space-y-4">
                                            <p className="text-[10px] font-black font-mono text-emerald-400 tracking-widest uppercase">SYS: Media captured successfully</p>
                                            <video src={recordedUrl} controls className="w-full rounded bg-[#02040a] max-h-60 border border-slate-700" />
                                            <div className="flex gap-3">
                                                <button onClick={downloadRecording}
                                                    className="flex-1 py-3 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-black font-mono text-[10px] uppercase tracking-widest rounded-lg">
                                                    DOWNLOAD_DUMP (.webm)
                                                </button>
                                                <button onClick={() => { setRecordedUrl(null); setRecordedChunks([]); }}
                                                    className="px-6 py-3 border border-rose-500/30 text-rose-400 hover:bg-rose-900/30 font-black font-mono text-[10px] uppercase tracking-widest rounded-lg">
                                                    PURGE
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB 2: UPLOAD */}
                            {activeTab === 2 && (
                                <div className="flex flex-col gap-6">
                                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                        <h3 className="text-sm font-black text-cyan-500 uppercase tracking-widest font-mono">FILE_UPLOAD_MATRIX</h3>
                                    </div>
                                    
                                    <label className="block cursor-pointer group">
                                        <div className="border border-dashed border-cyan-500/30 group-hover:border-cyan-400 bg-cyan-900/5 group-hover:bg-cyan-900/10 rounded-2xl p-10 text-center transition-all">
                                            <div className="text-4xl mb-4 font-mono text-cyan-500/50 group-hover:text-cyan-400 transition-colors">[+]</div>
                                            <p className="text-cyan-100 font-black font-mono text-sm tracking-widest uppercase mb-2">Drop payload here</p>
                                            <p className="text-slate-500 text-[10px] font-mono tracking-widest uppercase">Format: MP4, MOV, AVI, WEBM</p>
                                        </div>
                                        <input type="file" accept="video/*" multiple onChange={handleVideoUpload} className="hidden" />
                                    </label>

                                    {uploadedVideos.length > 0 && (
                                        <div className="space-y-4 pt-4 border-t border-slate-800">
                                            <div className="flex flex-wrap gap-2">
                                                {uploadedVideos.map(v => (
                                                    <button key={v.id} onClick={() => setActiveVideo(v)}
                                                        className={`px-4 py-2 rounded border text-[10px] font-black font-mono tracking-widest uppercase transition-all flex items-center gap-2 ${activeVideo?.id === v.id ? 'bg-cyan-900/30 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                                                        [FILE] {v.name.length > 15 ? v.name.slice(0, 15) + '…' : v.name}
                                                        <span className="text-slate-600 opacity-70 border-l border-slate-600 pl-2">{v.size}</span>
                                                    </button>
                                                ))}
                                            </div>
                                            
                                            {activeVideo && (
                                                <div className="border border-slate-700/50 rounded-xl bg-[#02040a] p-4 text-slate-300">
                                                    <video ref={videoPlayerRef} src={activeVideo.url} controls className="w-full rounded-lg bg-black mb-4 aspect-video" onTimeUpdate={e => setCurrentVideoTime(e.target.currentTime)} />
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">T_{formatTime(Math.floor(currentVideoTime))}</span>
                                                        <button onClick={stampTime} className="text-[10px] font-black font-mono text-cyan-400 hover:text-cyan-300 uppercase tracking-widest bg-cyan-900/20 px-3 py-1.5 rounded border border-cyan-500/30">
                                                            PIN_TIMESTAMP
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB 3: SUBTITLES */}
                            {activeTab === 3 && (
                                <div className="flex flex-col flex-1 gap-4">
                                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                        <h3 className="text-sm font-black text-cyan-500 uppercase tracking-widest font-mono">SUBTITLE_COMPOSER</h3>
                                        <div className="flex gap-2">
                                            <button onClick={addSubtitle} className="text-[9px] font-black px-3 py-1.5 bg-slate-800 border border-slate-600 text-slate-300 hover:text-white rounded font-mono uppercase tracking-widest transition-all hover:bg-slate-700">+ NEW_NODE</button>
                                            <button onClick={exportSrt} className="text-[9px] font-black px-3 py-1.5 bg-indigo-600/30 border border-indigo-500/50 hover:bg-indigo-600/50 text-indigo-300 rounded font-mono uppercase tracking-widest transition-all">EXTRACT .SRT</button>
                                        </div>
                                    </div>

                                    {activeVideo && (
                                        <div className="px-4 py-2 bg-indigo-900/10 border border-indigo-500/20 rounded font-mono text-[9px] text-indigo-300 uppercase tracking-widest flex items-center justify-between">
                                            <span>LINKED: {activeVideo.name}</span>
                                            <span className="font-bold border-l border-indigo-500/20 pl-3">T_{formatTime(Math.floor(currentVideoTime))}</span>
                                        </div>
                                    )}

                                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                                        {subtitles.map((s, i) => (
                                            <div key={s.id} className="bg-[#02040a] border border-slate-700/50 focus-within:border-cyan-500/50 rounded-lg p-3 flex gap-3 items-start transition-colors group">
                                                <span className="text-[10px] font-black text-slate-600 font-mono w-4 shrink-0 mt-2 bg-slate-800 text-center rounded">{(i + 1).toString().padStart(2,'0')}</span>
                                                <div className="flex gap-2 shrink-0">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">START (s)</span>
                                                        <input type="number" value={s.start} min={0} step={0.1} onChange={e => updateSub(s.id, 'start', e.target.value)}
                                                            className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[11px] text-cyan-200 font-mono focus:outline-none focus:border-cyan-500/50" />
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">END (s)</span>
                                                        <input type="number" value={s.end} min={0} step={0.1} onChange={e => updateSub(s.id, 'end', e.target.value)}
                                                            className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[11px] text-rose-200 font-mono focus:outline-none focus:border-rose-500/50" />
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block mb-1">PAYLOAD</span>
                                                    <textarea value={s.text} rows={2} onChange={e => updateSub(s.id, 'text', e.target.value)}
                                                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white placeholder-slate-600 font-mono resize-none focus:outline-none focus:border-cyan-500/50" />
                                                </div>
                                                <button onClick={() => removeSub(s.id)} className="text-slate-600 hover:text-rose-400 mt-5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* TAB 4: EDITOR */}
                            {activeTab === 4 && (
                                <div className="flex flex-col flex-1 h-full min-h-[400px]">
                                    <div className="flex items-center gap-3 mb-4 border-b border-slate-800 pb-3">
                                        <h3 className="text-sm font-black text-cyan-500 uppercase tracking-widest font-mono">FFMPEG_ENGINE</h3>
                                        <span className="text-[9px] px-2 py-0.5 bg-blue-900/30 border border-blue-500/30 text-blue-400 rounded font-mono uppercase tracking-widest">WASM INSTANCE</span>
                                    </div>
                                    {/* the VideoEditor internally handles its UI, hopefully it blends ok. */}
                                    <VideoEditor onSubmissionReady={(url) => { setSubmissionUrl(url); setShowSubmitModal(true); }} />
                                </div>
                            )}
                        </div>

                        {/* Submit Footer */}
                        {canWork && (
                            <div className="p-4 bg-[#090e17] border-t border-slate-800">
                                <button onClick={() => setShowSubmitModal(true)}
                                    className="w-full py-4 rounded-xl font-black text-[13px] tracking-widest uppercase font-mono bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] border border-cyan-400/50 transition-all hover:scale-[1.01] flex items-center justify-center gap-3">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    {isSubmitted ? 'OVERRIDE_PAYLOAD' : 'TRANSMIT_PAYLOAD'}
                                </button>
                            </div>
                        )}
                        {isSubmitted && <div className="px-4 pb-4 pt-1 text-center"><span className="inline-block px-3 py-1 bg-amber-900/20 border border-amber-500/30 rounded text-[10px] text-amber-400 font-mono uppercase tracking-widest">STATUS: AWAITING CLIENT VALIDATION. UPDATES PERMITTED.</span></div>}
                        {isApproved && <div className="px-4 p-4 text-center bg-emerald-900/10"><span className="inline-block px-3 py-1 bg-emerald-900/20 border border-emerald-500/30 rounded text-[10px] text-emerald-400 font-mono uppercase tracking-widest">STATUS: VALIDATED AND SEALED.</span></div>}
                    </div>
                </div>

                {/* ── RIGHT: Sidebar ── */}
                <div className="space-y-6">
                    {/* Time Stats */}
                    <div className="rounded-2xl border p-6 bg-[#090e17]/80 backdrop-blur-md" style={{ borderColor: 'rgba(51,65,85,0.7)' }}>
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono mb-4 border-b border-slate-800 pb-2">TELEMETRY_DATA</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1">TOTAL LOGGED</div>
                                <div className="text-2xl font-black text-white font-mono tracking-tighter">{formatMinutes(totalMinutes + (isTracking ? Math.floor(elapsed / 60) : 0))}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/50">
                                <div>
                                    <div className="text-[9px] text-slate-500 font-mono uppercase tracking-widest mb-1">CURRENT</div>
                                    <div className="text-sm font-black text-emerald-400 font-mono">{isTracking ? formatTime(elapsed) : 'IDLE'}</div>
                                </div>
                                <div>
                                    <div className="text-[9px] text-slate-500 font-mono uppercase tracking-widest mb-1">CYCLES</div>
                                    <div className="text-sm font-black text-white font-mono">{sessions.filter(s => s.check_out).length}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Session History */}
                    <div className="rounded-2xl border p-6 bg-[#090e17]/80 backdrop-blur-md flex flex-col max-h-[400px]" style={{ borderColor: 'rgba(51,65,85,0.7)' }}>
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono mb-4 border-b border-slate-800 pb-2 shrink-0">CONNECTION_LOGS</h3>
                        {sessions.length === 0 ? (
                            <p className="text-slate-600 text-[10px] text-center py-6 font-mono uppercase tracking-widest">NO_DATA_FOUND</p>
                        ) : (
                            <div className="space-y-3 overflow-y-auto pr-1 custom-scrollbar">
                                {sessions.map((s, i) => (
                                    <div key={s.id} className={`rounded p-3 border ${!s.check_out ? 'bg-emerald-900/10 border-emerald-500/30' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'} transition-colors`}>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest bg-slate-800 px-1.5 py-0.5 rounded">ID_{sessions.length - i}</span>
                                            <span className={`text-[10px] font-black font-mono uppercase tracking-widest ${!s.check_out ? 'text-emerald-400' : 'text-slate-300'}`}>
                                                {!s.check_out ? 'ACTIVE_LINK' : formatMinutes(s.duration_minutes)}
                                            </span>
                                        </div>
                                        <div className="text-[9px] font-mono uppercase tracking-widest space-y-1 opacity-80">
                                            <div className="flex gap-2"><span className="text-cyan-600">&gt;</span>{new Date(s.check_in).toLocaleString()}</div>
                                            {s.check_out && <div className="flex gap-2"><span className="text-rose-600">&lt;</span>{new Date(s.check_out).toLocaleString()}</div>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── SUBMIT MODAL ── */}
            {showSubmitModal && (
                <div className="fixed inset-0 bg-[#020617]/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#090e17] border border-cyan-500/40 rounded-2xl max-w-lg w-full p-8 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                        
                        <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2">INITIATE_TRANSMISSION</h3>
                        <p className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-800 pb-4">
                            TOTAL_LOG_TIME: <span className="text-cyan-400 font-black tracking-normal ml-1 bg-cyan-900/30 px-2 py-0.5 rounded border border-cyan-500/20">{formatMinutes(totalMinutes + (isTracking ? Math.floor(elapsed / 60) : 0))}</span>
                        </p>

                        <div className="space-y-6">
                            {/* File Upload */}
                            <div>
                                <label className="text-[10px] font-black font-mono text-cyan-500 uppercase tracking-widest block mb-2">FILE_PAYLOAD_DROP</label>
                                <label className="block cursor-pointer">
                                    <div className={`border border-dashed rounded-xl p-6 text-center transition-all ${
                                        submitFile
                                            ? 'border-emerald-500/50 bg-emerald-900/10'
                                            : 'border-slate-700 bg-[#02040a] hover:border-cyan-500/50 hover:bg-cyan-900/5'
                                    }`}>
                                        {submitFile ? (
                                            <div className="space-y-2">
                                                <p className="text-2xl">{submitFile.type.startsWith('video') ? '🎥' : '📦'}</p>
                                                <p className="text-emerald-300 font-bold text-sm truncate uppercase font-mono">{submitFile.name}</p>
                                                <p className="text-emerald-500/70 text-[10px] font-mono tracking-widest uppercase">{(submitFile.size / 1024 / 1024).toFixed(1)} MB</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <p className="text-2xl opacity-50 text-cyan-500">[+]</p>
                                                <p className="text-cyan-400 text-xs font-black uppercase font-mono tracking-widest">SELECT_LOCAL_FILE</p>
                                                <p className="text-slate-600 text-[9px] font-mono uppercase tracking-widest">MAX 500MB BUFFER</p>
                                            </div>
                                        )}
                                    </div>
                                    <input type="file" onChange={e => setSubmitFile(e.target.files?.[0] || null)} className="hidden" />
                                </label>
                            </div>

                            {/* Link Input */}
                            <div>
                                <label className="text-[10px] font-black font-mono text-indigo-400 uppercase tracking-widest block mb-2">OR_EXTERNAL_URI</label>
                                <input type="url" value={submissionUrl} onChange={e => setSubmissionUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full bg-[#02040a] border border-slate-700 rounded-lg px-4 py-3 text-indigo-200 placeholder-slate-700 text-sm focus:outline-none focus:border-indigo-500/50 font-mono" />
                            </div>

                            {/* Transmission Notes */}
                            <div>
                                <label className="text-[10px] font-black font-mono text-slate-400 uppercase tracking-widest block mb-2">ENCRYPTED_MESSAGE_TO_CLIENT</label>
                                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                                    placeholder="> Insert operational details..."
                                    className="w-full bg-[#02040a] border border-slate-700 rounded-lg px-4 py-3 text-slate-300 placeholder-slate-700 text-sm resize-none focus:outline-none focus:border-cyan-500/50 font-mono" />
                            </div>

                            {/* Submit Progress */}
                            {submitting && submitProgress > 0 && (
                                <div className="space-y-2">
                                    <div className="w-full bg-[#02040a] border border-slate-800 rounded-full h-1.5 overflow-hidden">
                                        <div className="bg-cyan-500 h-full transition-all duration-500 relative">
                                            <div className="absolute inset-0 bg-white/30" style={{ backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)' }}></div>
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-black text-cyan-500 font-mono uppercase tracking-widest text-right">
                                        {submitProgress < 60 ? 'UPLOADING...' : submitProgress < 90 ? 'SYNCING_DB...' : 'FINALIZING...'} {submitProgress}%
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button onClick={() => setShowSubmitModal(false)} disabled={submitting} 
                                className="flex-1 py-3 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 font-black rounded-xl text-[11px] font-mono tracking-widest uppercase transition-all">
                                CANCEL
                            </button>
                            <button onClick={handleSubmit} disabled={submitting || (!submitFile && !submissionUrl.trim())}
                                className="flex-[2] py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black rounded-xl border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-40 disabled:grayscale transition-all flex items-center justify-center gap-2 text-[11px] font-mono tracking-widest uppercase">
                                {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'EXECUTE_TRANSMISSION'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom scrollbar styles inside */}
            <style jsx="true">{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(15,23,42,0.5); }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(56,189,248,0.3); border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(56,189,248,0.6); }
            `}</style>
        </div>
    );
};

export default CheckpointWorkspace;
