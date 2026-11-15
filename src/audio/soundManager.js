import { Howl, Howler } from 'howler';

/**
 * Sound Manager for Virtual Wedding 3D
 * - Handles iOS Web Audio Context unlock
 * - Provides immediate Web Audio synthesized sound effects as reliable fallbacks
 *   so clicks, clinks, and cheers work even without external MP3 files!
 */
class SoundManager {
  constructor() {
    this.isUnlocked = false;
    this.isMuted = false;
    this.bgm = null;
  }

  /**
   * Unlock Web Audio on the first user interaction (tap / click).
   * Crucial for iOS Safari & Android in-app browsers.
   */
  unlockAudio() {
    if (this.isUnlocked) return;

    if (Howler.ctx && Howler.ctx.state === 'suspended') {
      Howler.ctx.resume();
    }

    this.isUnlocked = true;
    console.log('[SoundManager] Web Audio unlocked successfully.');
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    Howler.mute(this.isMuted);
    return this.isMuted;
  }

  /**
   * Play a crisp UI click sound using Web Audio API synthesis
   */
  playClick() {
    if (this.isMuted) return;
    this.unlockAudio();
    this._synthesizeTone(800, 0.05, 'sine');
  }

  /**
   * Play a playful cartoon munch/eat sound ("Nhoàm nhoàm!") synthesized via oscillators
   */
  playEat() {
    if (this.isMuted) return;
    this.unlockAudio();
    this._synthesizeTone(520, 0.08, 'triangle', 0.4);
    setTimeout(() => {
      this._synthesizeTone(680, 0.06, 'sine', 0.35);
    }, 90);
  }

  /**
   * Play a cheerful chat pop chime when a speech bubble appears
   */
  playChatPop() {
    if (this.isMuted) return;
    this.unlockAudio();
    this._synthesizeTone(880, 0.05, 'sine', 0.25);
    setTimeout(() => {
      this._synthesizeTone(1320, 0.08, 'sine', 0.3);
    }, 50);
  }

  /**
   * Play an authentic glass clink sound ("Keng!") synthesized via audio oscillators
   */
  playClink() {
    if (this.isMuted) return;
    this.unlockAudio();
    // High pitched shimmering glass frequency
    this._synthesizeTone(2400, 0.4, 'sine', 0.6);
    setTimeout(() => {
      this._synthesizeTone(3200, 0.25, 'triangle', 0.4);
    }, 15);
  }

  /**
   * Play Vietnamese drinking toast chant: "Hai ba dô! Hai ba dô! Hai ba uống!"
   * High energy authentic drinking chant with synchronized glass clinks.
   */
  playCheersChant() {
    if (this.isMuted) return;
    this.unlockAudio();

    // 1. Instant touch feedback clink
    this.playClink();

    // 2. Play the authentic uploaded Vietnamese chant audio file via Howler
    try {
      if (this._currentChant) {
        this._currentChant.stop();
      }
      this._currentChant = new Howl({
        src: ['/audio/cheers_chant.mp3', '/audio/cheers_chant.m4a', '/audio/cheers_chant.wav'],
        volume: 1.0,
        html5: false,
      });
      this._currentChant.play();
    } catch (e) {
      console.warn('[SoundManager] Audio file failed, using SpeechSynthesis fallback', e);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
          const utter = new SpeechSynthesisUtterance('Hai ba dô! Hai ba dô! Hai ba uống!');
          utter.lang = 'vi-VN';
          utter.rate = 1.3;
          window.speechSynthesis.speak(utter);
        } catch (err) {
          console.debug('[SoundManager] Speech synthesis error:', err);
        }
      }
    }

    // 3. Synchronized glass clinks matching the rhythmic chanting peaks:
    // Beat 1: Clink at first "Hai ba DÔ!" (~1.25s)
    setTimeout(() => {
      this.playClink();
    }, 1250);

    // Beat 2: Clink at second "Hai ba DÔ!" (~2.25s)
    setTimeout(() => {
      this.playClink();
    }, 2250);

    // Beat 3: Grand Clink & celebratory fanfare on "Hai ba UỐNG!" (~3.35s)
    setTimeout(() => {
      this.playClink();
      this.playEnterFanfare();
    }, 3350);
  }

  /**
   * Play explosive fireworks celebratory burst
   */
  playFireworks() {
    if (this.isMuted) return;
    this.unlockAudio();
    // Synthesize ascending whistle followed by rich explosion boom
    this._synthesizeTone(400, 0.2, 'sawtooth', 0.4);
    setTimeout(() => {
      this._synthesizeTone(180, 0.6, 'triangle', 0.8);
      this._synthesizeTone(90, 0.8, 'sine', 1.0);
    }, 180);
    setTimeout(() => {
      this.playClink();
    }, 350);
  }

  /**
   * Play a festive celebratory chime when entering wedding
   */
  playEnterFanfare() {
    if (this.isMuted) return;
    this.unlockAudio();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (Major chord)
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this._synthesizeTone(freq, 0.35, 'triangle', 0.5);
      }, idx * 120);
    });
  }

  /**
   * Synthesize tone using the native AudioContext
   * Zero external MP3 dependency guarantee.
   */
  _synthesizeTone(frequency, duration, type = 'sine', volume = 0.3) {
    try {
      const ctx = Howler.ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Graceful degradation
      console.debug('[SoundManager] Synthesizer silent fallback');
    }
  }
}

export const soundManager = new SoundManager();
export default soundManager;
