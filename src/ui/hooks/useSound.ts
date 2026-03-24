// Lightweight sound system using Web Audio API (no external files needed)

let audioCtx: AudioContext | null = null;
let enabled = true;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.15) {
  if (!enabled) return;
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
    // ignore audio errors
  }
}

function playNoise(duration: number, volume = 0.05) {
  if (!enabled) return;
  try {
    const ctx = getCtx();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * volume;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    source.connect(gain);
    gain.connect(ctx.destination);
    source.start();
  } catch {
    // ignore
  }
}

export const Sound = {
  toggle() {
    enabled = !enabled;
    return enabled;
  },

  isEnabled() {
    return enabled;
  },

  // Turn advance - soft click + whoosh
  turnAdvance() {
    playTone(800, 0.08, 'sine', 0.08);
    setTimeout(() => playNoise(0.15, 0.02), 30);
  },

  // Good event - bright chime
  goodEvent() {
    playTone(523, 0.15, 'sine', 0.12);
    setTimeout(() => playTone(659, 0.15, 'sine', 0.1), 100);
    setTimeout(() => playTone(784, 0.2, 'sine', 0.08), 200);
  },

  // Bad event - low warning
  badEvent() {
    playTone(220, 0.3, 'triangle', 0.12);
    setTimeout(() => playTone(196, 0.4, 'triangle', 0.1), 150);
  },

  // Critical event - urgent alarm
  criticalEvent() {
    playTone(440, 0.15, 'square', 0.06);
    setTimeout(() => playTone(440, 0.15, 'square', 0.06), 200);
    setTimeout(() => playTone(349, 0.3, 'square', 0.08), 400);
  },

  // Funding success - coin + fanfare
  fundingSuccess() {
    playTone(1047, 0.1, 'sine', 0.1);
    setTimeout(() => playTone(1319, 0.1, 'sine', 0.1), 80);
    setTimeout(() => playTone(1568, 0.15, 'sine', 0.1), 160);
    setTimeout(() => playTone(2093, 0.3, 'sine', 0.12), 260);
  },

  // Funding fail
  fundingFail() {
    playTone(330, 0.2, 'sine', 0.08);
    setTimeout(() => playTone(262, 0.4, 'sine', 0.06), 200);
  },

  // Feature release - achievement
  featureRelease() {
    playTone(659, 0.1, 'sine', 0.1);
    setTimeout(() => playTone(784, 0.1, 'sine', 0.1), 100);
    setTimeout(() => playTone(1047, 0.25, 'sine', 0.12), 200);
  },

  // Customer gained - cash register
  customerGain() {
    playTone(1200, 0.05, 'square', 0.04);
    setTimeout(() => playTone(1500, 0.08, 'square', 0.03), 50);
  },

  // Hire
  hire() {
    playTone(523, 0.1, 'sine', 0.08);
    setTimeout(() => playTone(659, 0.15, 'sine', 0.08), 100);
  },

  // IPO bell
  ipoBell() {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        playTone(880, 0.4, 'sine', 0.15);
        playTone(1760, 0.3, 'sine', 0.08);
      }, i * 500);
    }
  },

  // Game over
  gameOver() {
    playTone(440, 0.3, 'sine', 0.1);
    setTimeout(() => playTone(349, 0.3, 'sine', 0.08), 300);
    setTimeout(() => playTone(262, 0.5, 'sine', 0.06), 600);
  },

  // Achievement unlock
  achievement() {
    playTone(784, 0.1, 'sine', 0.1);
    setTimeout(() => playTone(988, 0.1, 'sine', 0.1), 80);
    setTimeout(() => playTone(1175, 0.1, 'sine', 0.1), 160);
    setTimeout(() => playTone(1568, 0.3, 'sine', 0.12), 240);
  },

  // Button click
  click() {
    playTone(600, 0.04, 'sine', 0.05);
  },

  // Bankruptcy
  bankrupt() {
    playTone(220, 0.5, 'sawtooth', 0.06);
    setTimeout(() => playTone(165, 0.6, 'sawtooth', 0.05), 400);
    setTimeout(() => playTone(110, 0.8, 'sawtooth', 0.04), 800);
  },
};
