import { useState, useRef, useEffect, useCallback } from "react";
import { extractAudioFromVideo } from "../utils/audioUtils";

export function useSubtitleGenerator() {
  const [status, setStatus] = useState("idle"); // idle, extracting, loading, transcribing, ready
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const worker = useRef(null);

  const terminateWorker = useCallback(() => {
    if (worker.current) {
      worker.current.terminate();
      worker.current = null;
    }
  }, []);

  const initializeWorker = useCallback(() => {
    if (worker.current) return worker.current;
    
    // Import the worker using Vite's constructor pattern
    const newWorker = new Worker(
      new URL("../workers/subtitle.worker.js", import.meta.url),
      { type: "module" }
    );

    newWorker.onmessage = (e) => {
      const { status, message, result, progress, file, error } = e.data;

      if (status === "progress") {
        // progress_callback data: { status, file, progress, ... }
        if (progress !== undefined) setProgress(progress);
        if (file) setMessage(`Downloading ${file}...`);
      } else if (status === "loading") {
        setStatus("loading");
        setMessage(message);
      } else if (status === "ready") {
        setStatus("ready");
        setMessage("AI Model Ready");
      } else if (status === "transcribing") {
        setStatus("transcribing");
        setMessage(message);
      } else if (status === "complete") {
        setStatus("idle");
        setProgress(100);
        setMessage("Transcription Complete");
        // Result format from transformers.js pipe is usually: { text, chunks: [{ timestamp: [s, e], text }, ...] }
        return result; 
      } else if (status === "error") {
        setStatus("idle");
        setError(error);
        setMessage("Error: " + error);
      }
    };

    worker.current = newWorker;
    return newWorker;
  }, []);

  const generateSubtitles = async (videoFile, modelId = "onnx-community/whisper-tiny_timestamped") => {
    try {
      setError(null);
      setProgress(0);
      
      setStatus("extracting");
      setMessage("Extracting audio from video...");
      const audioData = await extractAudioFromVideo(videoFile);

      const w = initializeWorker();
      
      return new Promise((resolve, reject) => {
        const handleMessage = (e) => {
          if (e.data.status === "complete") {
            w.removeEventListener("message", handleMessage);
            resolve(e.data.result);
          } else if (e.data.status === "error") {
            w.removeEventListener("message", handleMessage);
            reject(new Error(e.data.error));
          }
        };
        w.addEventListener("message", handleMessage);
        
        w.postMessage({ type: "run", data: { audio: audioData, modelId } });
      });
    } catch (err) {
      setStatus("idle");
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    return () => terminateWorker();
  }, [terminateWorker]);

  return { 
    status, 
    progress, 
    message, 
    error, 
    generateSubtitles,
    terminateWorker 
  };
}
