import Phaser from "phaser";
import { PongPlop } from "../consts/AudioKeys";
import { White } from "../consts/Colors";
import { PressStart2P } from "../consts/Fonts";
import { AISpeed, GameState } from "../consts/GameConstants";
import { GameBackground, GameOver, TitleScreen } from "../consts/SceneKeys";

export default class Game extends Phaser.Scene {
  gameState: GameState;
  paddleRightVelocity: Phaser.Math.Vector2;
  leftScore: number;
  rightScore: number;
  ball: Phaser.GameObjects.Arc;
  paddleLeft: Phaser.GameObjects.Rectangle;
  paddleRight: Phaser.GameObjects.Rectangle;
  leftScoreLabel: Phaser.GameObjects.Text;
  rightScoreLabel: Phaser.GameObjects.Text;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  init() {
    this.gameState = GameState.Running;

    this.paddleRightVelocity = new Phaser.Math.Vector2(0, 0);

    this.leftScore = 0;
    this.rightScore = 0;
  }

  preload() {}

  create() {
    this.scene.run(GameBackground);
    this.scene.sendToBack(GameBackground);

    this.physics.world.setBounds(-100, 0, 1000, 500);

    this.ball = this.add.circle(400, 250, 10, White, 1);
    this.physics.add.existing(this.ball);
    const body = this.ball.body as Phaser.Physics.Arcade.Body;
    body.setBounce(1, 1);
    body.setMaxSpeed(600);

    body.setCollideWorldBounds(true, 1, 1);
    body.onWorldBounds = true;

    this.paddleLeft = this.add.rectangle(50, 250, 30, 100, White, 1);
    this.physics.add.existing(this.paddleLeft, true);

    this.paddleRight = this.add.rectangle(750, 250, 30, 100, White, 1);
    this.physics.add.existing(this.paddleRight, true);

    this.physics.add.collider(
      this.paddleLeft,
      this.ball,
      this.handlePaddleBallCollision,
      undefined,
      this
    );
    this.physics.add.collider(
      this.paddleRight,
      this.ball,
      this.handlePaddleBallCollision,
      undefined,
      this
    );

    this.physics.world.on(
      "worldbounds",
      this.handleBallWorldBoundsCollision,
      this
    );

    const scoreStyle = { fontSize: "48px", fontFamily: PressStart2P };
    this.leftScoreLabel = this.add
      .text(300, 125, "0", scoreStyle)
      .setOrigin(0.5, 0.5);

    this.rightScoreLabel = this.add
      .text(500, 375, "0", scoreStyle)
      .setOrigin(0.5, 0.5);
    this.cursors = this.input.keyboard.createCursorKeys();

    this.resetBall();
  }

  update() {
    if (this.gameState !== GameState.Running) return;

    this.handlePlayerInput();

    this.updateAI();

    this.checkScore();
  }

  // ========== Sounds ==========
  handleBallWorldBoundsCollision(body, up, down, left, right) {
    if (left || right) return;
    this.sound.play(PongPlop);
  }
  handlePaddleBallCollision() {
    this.sound.play(PongPlop);

    const body = this.ball.body as Phaser.Physics.Arcade.Body;
    const vel = this.ball.body.velocity;
    vel.x *= 1.15;
    vel.y *= 1.15;

    body.setVelocity(vel.x, vel.y);
  }

  // ========== Game Controls ==========
  handlePlayerInput() {
    const body = this.paddleLeft.body as Phaser.Physics.Arcade.StaticBody;

    if (this.cursors.up.isDown) {
      this.paddleLeft.y -= 10;
      body.updateFromGameObject();
    } else if (this.cursors.down.isDown) {
      this.paddleLeft.y += 10;
      body.updateFromGameObject();
    }

    this.input.keyboard.on(`keydown-R`, () => {
      this.resetBall();
    });

    this.input.keyboard.once(`keydown-ESC`, () => {
      this.scene.stop(GameBackground);
      this.scene.start(TitleScreen);
    });
  }

  updateAI() {
    const diff = this.ball.y - this.paddleRight.y;
    const paddleRightBody = this.paddleRight
      .body as Phaser.Physics.Arcade.StaticBody;

    if (Math.abs(diff) < 10) return;

    if (diff < 0) {
      this.paddleRightVelocity.y = -AISpeed;
      if (this.paddleRightVelocity.y < -10) this.paddleRightVelocity.y = -10;
    } else if (diff > 0) {
      this.paddleRightVelocity.y = AISpeed;
      if (this.paddleRightVelocity.y < 10) this.paddleRightVelocity.y = 10;
    }
    this.paddleRight.y += this.paddleRightVelocity.y;
    paddleRightBody.updateFromGameObject();
  }

  // ========== Scoring ==========
  checkScore() {
    const x = this.ball.x;

    const leftBounds = -30;
    const rightBounds = 830;
    if (x >= leftBounds && x <= rightBounds) return;

    if (x < leftBounds) {
      this.resetBall();
      this.incrementRightScore();
    } else if (x > rightBounds) {
      this.resetBall();
      this.incrementLeftScore();
    }

    const maxScore = 3;
    if (this.leftScore >= maxScore) this.gameState = GameState.PlayerWon;

    if (this.rightScore >= maxScore) this.gameState = GameState.AIWon;

    if (this.gameState === GameState.Running) {
      this.resetBall();
    } else {
      this.ball.active = false;
      const body = this.ball.body as Phaser.Physics.Arcade.Body;
      this.physics.world.remove(body);

      this.scene.stop(GameBackground);

      this.scene.start(GameOver, {
        leftScore: this.leftScore,
        rightScore: this.rightScore,
      });
    }
  }

  incrementLeftScore() {
    this.leftScore += 1;
    this.leftScoreLabel.text = this.leftScore.toString();
  }

  incrementRightScore() {
    this.rightScore += 1;
    this.rightScoreLabel.text = this.rightScore.toString();
  }

  // ========== Reset ==========
  resetBall() {
    this.ball.setPosition(400, 250);
    const body = this.ball.body as Phaser.Physics.Arcade.Body;
    const angle = Phaser.Math.Between(0, 360);
    const vec = this.physics.velocityFromAngle(angle, 200);
    body.setVelocity(vec.x, vec.y);
  }
}
