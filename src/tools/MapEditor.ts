export default class MapEditor {
  tileMarker: Phaser.GameObjects.Graphics | undefined
  scene: Phaser.Scene
  tileSize = 64
  cursorOffset = this.tileSize / 2
  gridSize = this.tileSize / 2
  getPlatformGroup: (() => Phaser.Physics.Arcade.StaticGroup | undefined) = () => undefined
  isEnabled: boolean

  constructor (scene: Phaser.Scene, getPlatformGroup: () => undefined | Phaser.Physics.Arcade.StaticGroup) {
    this.scene = scene
    this.getPlatformGroup = getPlatformGroup
    this.isEnabled = false
  }

  #getCoordinateInGrid (coordinate: number): number {
    const precision = this.gridSize

    return Math.floor(coordinate / precision) * precision
  }

  create (): void {
    if (this.tileMarker == null) {
      this.tileMarker = this.scene.add.graphics({ lineStyle: { width: 5, color: 0xffffff, alpha: 1 } })
    }

    this.tileMarker.strokeRect(0, 0, this.tileSize, this.tileSize)

    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.leftButtonDown() && (this.tileMarker != null) && this.isEnabled) {
        const tileX = this.tileMarker.x + this.cursorOffset
        const tileY = this.tileMarker.y + this.cursorOffset
        const tile = this.getPlatformGroup()?.children.entries.find(
          tile => tile.body.position.x + this.cursorOffset === tileX && tile.body.position.y + this.cursorOffset === tileY
        )

        if (tile != null) {
          this.getPlatformGroup()?.remove(tile, true, true)
        } else {
          const tile = this.scene.add.image(this.tileMarker.x + this.cursorOffset, this.tileMarker.y + this.cursorOffset, 'tile_5')
          this.getPlatformGroup()?.add(tile)
        }
      }
    })

    this.scene.input.keyboard.on('keydown-P', () => {
      this.isEnabled = !this.isEnabled
    }, this.scene)
  }

  update (pointerX: number, pointerY: number): void {
    if (this.tileMarker != null) {
      this.tileMarker.setY(this.#getCoordinateInGrid(pointerY - this.cursorOffset))
      this.tileMarker.setX(this.#getCoordinateInGrid(pointerX - this.cursorOffset))
    }
  }
}
