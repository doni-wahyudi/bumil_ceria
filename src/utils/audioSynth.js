/**
 * Web Audio API Relaxation Sound Synthesizer
 * Pure client-side synthesis: zero external audio assets or network downloads required.
 */

class AudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.activeTrack = null;
    this.timerId = null;
    this.gainNode = null;
    this.noiseBuffer = null;
    this.volume = 0.5;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (!this.gainNode) {
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  stop() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.activeSource) {
      try {
        this.activeSource.stop();
        this.activeSource.disconnect();
      } catch (e) {
        // ignore if already stopped
      }
      this.activeSource = null;
    }
    this.activeTrack = null;
  }

  /**
   * 1. Womb Heartbeat (Denyut Jantung Janin / Rahim)
   * Rhythmic lub-dub pulse at ~72 BPM
   */
  playHeartbeat() {
    this.init();
    this.stop();
    this.activeTrack = 'heartbeat';

    const playThump = () => {
      if (this.activeTrack !== 'heartbeat' || !this.ctx) return;
      const now = this.ctx.currentTime;

      // "Lub" sound (first heart beat sound)
      this._createThump(now, 68, 0.14, 0.7);

      // "Dub" sound (second heart beat sound, slightly higher and shorter, 260ms later)
      this._createThump(now + 0.26, 82, 0.11, 0.5);
    };

    // Play immediately and interval every ~833ms (72 bpm)
    playThump();
    this.timerId = setInterval(playThump, 833);
  }

  _createThump(time, freq, duration, gainAmount) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.exponentialRampToValueAtTime(32, time + duration);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, time);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(gainAmount, time + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.gainNode);

    osc.start(time);
    osc.stop(time + duration + 0.05);
  }

  /**
   * Helper: Generate a 5-second buffer of pink noise
   */
  _getPinkNoiseBuffer() {
    if (this.noiseBuffer) return this.noiseBuffer;
    const bufferSize = this.ctx.sampleRate * 5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    this.noiseBuffer = buffer;
    return buffer;
  }

  /**
   * 2. Gentle Ocean Waves (Deburan Ombak Lembut)
   * Sweeping pink noise mimicking tidal wash
   */
  playWaves() {
    this.init();
    this.stop();
    this.activeTrack = 'waves';

    const buffer = this._getPinkNoiseBuffer();
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    // Filter simulating ocean wash
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, this.ctx.currentTime);

    // LFO to modulate filter frequency slowly (every 7 seconds)
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.14, this.ctx.currentTime); // ~7.1s cycle

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(280, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    // Dynamic wave volume swelling
    const waveGain = this.ctx.createGain();
    waveGain.gain.setValueAtTime(0.4, this.ctx.currentTime);

    source.connect(filter);
    filter.connect(waveGain);
    waveGain.connect(this.gainNode);

    source.start();
    lfo.start();
    this.activeSource = source;
  }

  /**
   * 3. Calm Rain (Hujan Rintik Tenang)
   * Soft rain noise with gentle resonant bandpass
   */
  playRain() {
    this.init();
    this.stop();
    this.activeTrack = 'rain';

    const buffer = this._getPinkNoiseBuffer();
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
    filter.Q.setValueAtTime(0.7, this.ctx.currentTime);

    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    source.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(this.gainNode);

    source.start();
    this.activeSource = source;
  }

  /**
   * 4. Relaxing Chime (Nada Meditasi / 528Hz Solfeggio)
   */
  playTone(freq = 528, duration = 2.5) {
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.gainNode);

    osc.start(now);
    osc.stop(now + duration);
  }
}

export const audioSynth = new AudioSynthesizer();
