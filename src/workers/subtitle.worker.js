import { pipeline, env } from "@huggingface/transformers";

// Skip local check, download from mirror/Hugging Face
env.allowLocalModels = false;
env.useBrowserCache = true;

class PipelineSingleton {
  static currentModelId = null;
  static instance = null;

  static resetInstance() {
    this.instance = null;
    this.currentModelId = null;
  }

  static async getInstance(modelId = "onnx-community/whisper-tiny_timestamped", progress_callback) {
    if (this.currentModelId && this.currentModelId !== modelId) {
      this.resetInstance();
    }
    if (!this.instance) {
      this.currentModelId = modelId;
      this.instance = pipeline("automatic-speech-recognition", modelId, {
        dtype: {
          encoder_model: "fp32", // 'fp32' is safer for wasm
          decoder_model_merged: "q4", // quantized decoder for speed
        },
        device: "webgpu", // Try webgpu first
        progress_callback,
      }).catch(err => {
        console.error("WebGPU failed, falling back to WASM", err);
        return pipeline("automatic-speech-recognition", modelId, {
          dtype: "q8",
          device: "wasm",
          progress_callback,
        });
      });
    }
    return this.instance;
  }
}

self.addEventListener("message", async (e) => {
  const { type, data } = e.data;
  if (type === "load") {
    await handleLoad(data);
  } else if (type === "run") {
    await handleRun(data);
  }
});

async function handleLoad({ modelId }) {
  self.postMessage({ status: "loading", message: "Initializing AI model..." });
  try {
    await PipelineSingleton.getInstance(modelId, (p) => {
      self.postMessage({ status: "progress", ...p });
    });
    self.postMessage({ status: "ready" });
  } catch (error) {
    self.postMessage({ status: "error", error: error.message });
  }
}

async function handleRun({ audio, language = "en", modelId }) {
  try {
    const transcriber = await PipelineSingleton.getInstance(modelId);
    
    self.postMessage({ status: "transcribing", message: "Analyzing audio..." });
    
    const result = await transcriber(audio, {
      language,
      chunk_length_s: 30,
      stride_length_s: 5,
      return_timestamps: "word",
      force_full_sequences: false,
    });

    self.postMessage({ status: "complete", result });
  } catch (error) {
    self.postMessage({ status: "error", error: error.message });
  }
}
