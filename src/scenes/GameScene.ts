import Phaser from 'phaser';
import Player from "../sprites/player";

export default class GameScene extends Phaser.Scene {
    cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    player: Player | undefined;
    platforms: Phaser.Physics.Arcade.StaticGroup | undefined;
    ground: Phaser.GameObjects.Rectangle | undefined;

    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.image('logo', 'assets/phaser3-logo.png');
        this.load.image('player', 'assets/player/playerRed_up1.png');
    }

    create() {
        if (!this.player) {
            this.player = new Player(
                this,
                400,
                0,
                'player'
            )
        }

        if (!this.cursors) {
            this.cursors = this.input.keyboard.createCursorKeys();
        }

        if (!this.platforms) {
            this.platforms = this.physics.add.staticGroup();
        }

        this.physics.add.collider(this.player, this.platforms);

        this.ground = this.add.rectangle(0, 600, 1600, 100, 0x6666ff);
        this.platforms.add(this.ground);
    }

    update() {
        const onKeyUpListener = (fn: (event: KeyboardEvent) => void) => this.input.keyboard.on('keyup', fn);

        if (this.player && this.cursors) {
            this.player.update(this.cursors, onKeyUpListener);
        }
    }
}
