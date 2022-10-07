export default class Player extends Phaser.Physics.Arcade.Sprite {
    preparedVelocityY: number;
    preparedVelocityX: number;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, frame?: string | number) {
        super(scene, x, y, texture, frame);

        scene.physics.world.enable(this);
        scene.add.existing(this);

        this.setBounce(0.2);
        this.setCollideWorldBounds(true);

        this.preparedVelocityX = 0;
        this.preparedVelocityY = 0;
    }

    walk(direction?: 'left' | 'right') {
        if (direction) {
            const walkingSpeed = 160;
            const velocity = direction === 'left'
                ? walkingSpeed * -1
                : walkingSpeed;
            this.setVelocityX(velocity);
        } else {
            this.setVelocityX(0);
        }
    }

    jump() {
        if (this.preparedVelocityY) {
            this.setVelocityY(this.preparedVelocityY);
            this.preparedVelocityY = 0;
        }

        if (this.preparedVelocityX) {
            this.setVelocityX(this.preparedVelocityX);
            this.preparedVelocityX = 0;
        }
    }

    prepareJumpHeight() {
        const maxJumpSpeed = -330;
        const oldJumpSpeed = this.preparedVelocityY;
        this.preparedVelocityY = Math.max(maxJumpSpeed, oldJumpSpeed - 10);
    }

    prepareJumpDirection(direction?: 'left' | 'right') {
       const horizontalSpeed = 160;

       if (direction) {
           this.preparedVelocityX = direction === 'left' ?
               -1 * horizontalSpeed :
               horizontalSpeed;
       } else {
           this.preparedVelocityX = 0;
       }
    }

    update(
        cursors: Phaser.Types.Input.Keyboard.CursorKeys,
        onKeyUpListener: (fn: (event: KeyboardEvent) => void) => Phaser.Input.Keyboard.KeyboardPlugin
    ) {
        if (this.body.touching.down) {
            if (cursors.up.isDown) {
                this.walk();
                this.prepareJumpHeight();

                if (cursors.left.isDown) {
                    this.prepareJumpDirection('left');
                } else if (cursors.right.isDown) {
                    this.prepareJumpDirection('right');
                } else {
                    this.prepareJumpDirection();
                }
            } else {
                if (cursors.left.isDown) {
                    this.walk('left');
                } else if (cursors.right.isDown) {
                    this.walk('right');
                } else {
                    this.walk();
                }
            }
        }

        onKeyUpListener((event) => {
            if (event.key === 'ArrowUp') {
                this.jump();
            }
        });
    }
}
