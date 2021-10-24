import Phaser from "phaser";
import { PongBeep } from "../consts/AudioKeys";
import { LargeTitle, PressStart2P } from "../consts/Fonts";
import { GameTitle, StartTitle } from "../consts/GameTexts";
import { Game } from "../consts/SceneKeys";

export default class TitleScreen extends Phaser.Scene {
  preload() {}

  create() {
    const title = this.add.text(400, 250, GameTitle, {
      fontFamily: PressStart2P,
      fontSize: LargeTitle,
    });
    title.setOrigin(0.5, 0.5);

    this.add
      .text(400, 300, StartTitle, {
        fontFamily: PressStart2P,
      })
      .setOrigin(0.5);

    this.input.keyboard.once(`keydown-SPACE`, () => {
      this.sound.play(PongBeep);
      this.scene.start(Game);
    });
  }
}
