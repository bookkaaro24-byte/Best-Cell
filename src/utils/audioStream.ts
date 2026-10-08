/**
 * Audio streaming utilities for Gemini Live API (gemini-3.8-live)
 * - Input: 16kHz mono 16-bit PCM little-endian
 * - Output: 24kHz mono 16-bit PCM little-endian
 */

// Convert Float32Array from microphone capture to 16-bit PCM base64 string
export function float32ToPcm16Base64(float32Array: Float32Array): string {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  const bytes = new Uint8Array(int16Array.buffer);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Convert base64-encoded PCM16 (24kHz mono) into an AudioBuffer
export function pcm16Base64ToAudioBuffer(
  audioCtx: AudioContext,
  base64Data: string,
  sampleRate = 24000
): AudioBuffer {
  const binary = atob(base64Data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const int16 = new Int16Array(bytes.buffer);
  const float32 = new Float32Array(int16.length);
  for (let i = 0; i < int16.length; i++) {
    float32[i] = int16[i] / 32768.0;
  }
  const audioBuffer = audioCtx.createBuffer(1, float32.length, sampleRate);
  audioBuffer.copyToChannel(float32, 0);
  return audioBuffer;
}

// Gapless audio player queue class for Live API playback
export class LiveAudioPlayer {
  private audioCtx: AudioContext | null = null;
  private nextStartTime = 0;
  private activeSources: AudioBufferSourceNode[] = [];

  constructor() {
    // AudioContext will be initialized upon user gesture
  }

  private getContext(): AudioContext {
    if (!this.audioCtx || this.audioCtx.state === 'closed') {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtxClass({ sampleRate: 24000 });
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public playChunk(base64Data: string) {
    try {
      const ctx = this.getContext();
      const buffer = pcm16Base64ToAudioBuffer(ctx, base64Data, 24000);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);

      const currentTime = ctx.currentTime;
      // If nextStartTime is in the past, reset to now
      if (this.nextStartTime < currentTime) {
        this.nextStartTime = currentTime;
      }

      source.start(this.nextStartTime);
      this.nextStartTime += buffer.duration;
      this.activeSources.push(source);

      source.onended = () => {
        const idx = this.activeSources.indexOf(source);
        if (idx !== -1) {
          this.activeSources.splice(idx, 1);
        }
      };
    } catch (err) {
      console.error('LiveAudioPlayer playChunk error:', err);
    }
  }

  public stopAndClear() {
    for (const source of this.activeSources) {
      try {
        source.stop();
        source.disconnect();
      } catch (_) {}
    }
    this.activeSources = [];
    if (this.audioCtx) {
      this.nextStartTime = this.audioCtx.currentTime;
    } else {
      this.nextStartTime = 0;
    }
  }

  public close() {
    this.stopAndClear();
    if (this.audioCtx) {
      try {
        this.audioCtx.close();
      } catch (_) {}
      this.audioCtx = null;
    }
  }
}
