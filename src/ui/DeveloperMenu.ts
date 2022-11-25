import Image = Phaser.GameObjects.Image
import { downloadMap } from '../tools/MapLoader'
import { PlatformGroupGetter } from '../types'

export default class DeveloperMenu {
  gameScene: Phaser.Scene | undefined
  saveMapButton: Phaser.GameObjects.Text | undefined
  getPlatformGroup: PlatformGroupGetter = () => undefined

  constructor (gameScene: Phaser.Scene, getPlatformGroup: PlatformGroupGetter) {
    this.gameScene = gameScene
    this.getPlatformGroup = getPlatformGroup
  }

  #saveMap (platformGroup: Phaser.Physics.Arcade.StaticGroup | undefined): void {
    if (platformGroup != null) {
      const blocks = platformGroup.children.entries.filter((object): object is Image => Boolean(object.texture))

      downloadMap(blocks)
    }
  }

  create (): void {
    if (this.gameScene != null) {
      this.saveMapButton = this.gameScene.add.text(50, 50, 'Save Map')
      this.saveMapButton.setInteractive()

      this.saveMapButton.on('pointerdown', () => {
        this.saveMapButton?.setStyle({ fill: 'yellow' })
      })

      this.saveMapButton.on('pointerup', () => {
        this.saveMapButton?.setStyle({ fill: 'white' })
        this.#saveMap(this.getPlatformGroup())
      })
    }
  }
}
