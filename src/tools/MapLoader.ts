import Image = Phaser.GameObjects.Image
import { Scene } from 'phaser'
import { PlatformGroupGetter } from '../types'
import StaticGroup = Phaser.Physics.Arcade.StaticGroup
const { saveAs } = await import('file-saver')
  .then(obj => { console.log(obj); return obj })
  .catch(() => { console.log('not in dev environment!'); return { saveAs: undefined } })

interface Tile {
  positionX: number
  positionY: number
  imageKey: string
}

const downloadMap = (gameObjects: Image[]): void => {
  const tiles: Tile[] = gameObjects.map(object => ({
    positionX: object.body.position.x,
    positionY: object.body.position.y,
    imageKey: object.texture.key
  }))

  if (saveAs !== undefined) {
    saveAs(new Blob([
      JSON.stringify(tiles)
    ], { type: 'application/json' }))
  }
}

class MapLoader {
  gameScene: Scene
  mapName: string

  constructor (gameScene: Scene, mapName: string) {
    this.gameScene = gameScene
    this.mapName = mapName
  }

  preload (): void {
    this.gameScene.load.json(this.mapName, `assets/levels/${this.mapName}.json`)
  }

  create (platformGroup: StaticGroup): void {
    const tiles: Tile[] | undefined = this.gameScene.cache.json.get(this.mapName)

    tiles?.forEach(tile => {
      const tileImage = this.gameScene.add.image(tile.positionX, tile.positionY, tile.imageKey)
      platformGroup.add(tileImage)
    })
  }
}

export { downloadMap, MapLoader }
