// AudioManager — clean hooks for every game event. Missing files never crash.
import type Phaser from "phaser";
import { sfx, setSfxVolume } from "./sfx";
const TRACKS: { url: string }[] = Object.values(
  import.meta.glob<{ url: string }>("./music/*.asset.json", { eager: true, import: "default" }),
);

export type AudioEvent =
  | "playerAttack" | "enemyHit" | "enemyDeath" | "jump" | "land" | "dash" | "hurt" | "block" | "parry"
  | "waveStart" | "waveClear" | "levelUp" | "upgrade" | "bossEntrance" | "bossAttack" | "bossDeath"
  | "coin" | "special" | "tick" | "go";

const SYNTH: Record<AudioEvent, () => void> = {
  playerAttack: sfx.swing, enemyHit: sfx.hit, enemyDeath: sfx.kill, jump: sfx.jump, land: sfx.land,
  dash: sfx.dash, hurt: sfx.hurt, block: sfx.block, parry: sfx.parry, waveStart: sfx.go, waveClear: sfx.chime,
  levelUp: sfx.chime, upgrade: sfx.coin, bossEntrance: sfx.horn, bossAttack: sfx.dash, bossDeath: sfx.horn,
  coin: sfx.coin, special: sfx.special, tick: sfx.tick, go: sfx.go,
};
// Optional file overrides: event -> Phaser audio key (loaded in preload if present)
const FILES: Partial<Record<AudioEvent, string>> = { levelUp: "magic", bossDeath: "magic" };

export class AudioManager {
  private music?: Phaser.Sound.BaseSound;
  constructor(private scene: Phaser.Scene) {}
  musicVol = 0.5;
  sfxVol = 0.8;
  setVolumes(music: number, sfxV: number) {
    this.musicVol = music;
    this.sfxVol = sfxV;
    setSfxVolume(sfxV);
    if (this.music) (this.music as Phaser.Sound.WebAudioSound).setVolume?.(music * 0.6);
  }
  startMusic() {
    try {
      if (!this.scene.cache.audio.exists("music")) return;
      this.music = this.scene.sound.get("music") ?? this.scene.sound.add("music", { loop: true });
      (this.music as Phaser.Sound.WebAudioSound).setVolume?.(this.musicVol * 0.6);
      if (!this.music.isPlaying) this.music.play();
    } catch {
      /* audio unavailable */
    }
  }
  /** Each area gets its own song from the music pack; streamed on demand so startup stays light. */
  playTrack(index: number) {
    try {
      const n = index % TRACKS.length;
      const key = `track${n}`;
      const start = () => {
        if (!this.scene.cache.audio.exists(key)) return;
        const next = this.scene.sound.add(key, { loop: true, volume: 0 });
        const prev = this.music;
        this.music = next;
        next.play();
        this.scene.tweens.add({ targets: next, volume: this.musicVol * 0.6, duration: 1200 });
        if (prev) this.scene.tweens.add({ targets: prev, volume: 0, duration: 900, onComplete: () => prev.destroy() });
      };
      if (this.scene.cache.audio.exists(key)) return start();
      this.scene.load.audio(key, TRACKS[n]!.url);
      this.scene.load.once(`filecomplete-audio-${key}`, start);
      this.scene.load.start();
    } catch {
      /* audio unavailable */
    }
  }
  play(e: AudioEvent) {
    try {
      const f = FILES[e];
      if (f && this.scene.cache.audio.exists(f)) this.scene.sound.play(f, { volume: 0.4 * this.sfxVol });
      else SYNTH[e]();
    } catch {
      /* never break the game on audio */
    }
  }
}
