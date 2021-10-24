import Phaser from "phaser";
import { PongBeep, PongPlop } from "../consts/AudioKeys";
import { TitleScreen } from "../consts/SceneKeys";
import WebFontFile from "./WebFontFile";

export default class Preload extends Phaser.Scene {
  preload() {
    const fonts = new WebFontFile(this.load, "Press Start 2P");
    this.load.addFile(fonts);

    this.load.audio(PongBeep, "assets/ping_pong_8bit_beeep.ogg");
    this.load.audio(PongPlop, "assets/ping_pong_8bit_plop.ogg");
  }

  create() {
    this.scene.start(TitleScreen);
  }
}
