export async function extractAudioFromVideo(videoFile) {
  // Read file as ArrayBuffer
  const buffer = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(videoFile);
  });

  // Create audio context with specific sample rate (16kHz for Whisper)
  const audioContext = new (window.AudioContext || window.webkitAudioContext)({
    sampleRate: 16000,
  });

  try {
    // Decode audio data - this automatically downsamples to 16kHz
    const audioBuffer = await audioContext.decodeAudioData(buffer);

    // Handle stereo vs mono
    if (audioBuffer.numberOfChannels === 2) {
      // Merge channels for stereo to mono conversion
      const SCALING_FACTOR = Math.sqrt(2);
      const left = audioBuffer.getChannelData(0);
      const right = audioBuffer.getChannelData(1);
      const audio = new Float32Array(left.length);

      for (let i = 0; i < audioBuffer.length; ++i) {
        audio[i] = (SCALING_FACTOR * (left[i] + right[i])) / 2;
      }
      return audio;
    } else {
      // Return the first channel for mono
      return audioBuffer.getChannelData(0);
    }
  } catch (e) {
    console.error("Audio extraction error:", e);
    throw new Error(`Error processing audio: ${e instanceof Error ? e.message : String(e)}`);
  } finally {
    await audioContext.close();
  }
}
