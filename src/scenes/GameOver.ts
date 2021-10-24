import Phaser from "phaser";
import { MediumTitle, PressStart2P } from "../consts/Fonts";
import { AIVictory, ContinueGame, PlayerVictory } from "../consts/GameTexts";
import { TitleScreen } from "../consts/SceneKeys";

interface Data {
  leftScore: number;
  rightScore: number;
}

export default class GameOver extends Phaser.Scene {
  create(data: Data) {
    let gameEndTitle = AIVictory;

    if (data.leftScore > data.rightScore) {
      gameEndTitle = PlayerVictory;
    }

    console.log(gameEndTitle);
    this.add
      .text(400, 200, gameEndTitle, {
        fontFamily: PressStart2P,
        fontSize: MediumTitle,
      })
      .setOrigin(0.5);

    this.add
      .text(400, 300, ContinueGame, {
        fontFamily: PressStart2P,
      })
      .setOrigin(0.5);

    this.input.keyboard.once(`keydown-SPACE`, () => {
      this.scene.start(TitleScreen);
    });
  }
}
