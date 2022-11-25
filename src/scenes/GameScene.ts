import Phaser from 'phaser'
import Player from '../sprites/Player'
import MapEditor from '../tools/MapEditor'
import DeveloperMenu from '../ui/DeveloperMenu'
import { MapLoader } from '../tools/MapLoader'
import { PlatformGroupGetter } from '../types'

export default class GameScene extends Phaser.Scene {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined
  player: Player | undefined
  platforms: Phaser.Physics.Arcade.StaticGroup | undefined
  mapEditor: MapEditor
  developerMenu: DeveloperMenu
  mapLoader: MapLoader

  constructor () {
    super('GameScene')
    const getPlatformGroup: PlatformGroupGetter = () => this.platforms
    this.mapEditor = new MapEditor(this, getPlatformGroup)
    this.developerMenu = new DeveloperMenu(this, getPlatformGroup)
    this.mapLoader = new MapLoader(this, 'level_0', getPlatformGroup)
  }

  preload (): void {
    this.load.image('logo', 'assets/phaser3-logo.png')
    this.load.image('player', 'assets/player/playerRed_up1.png')
    this.load.image('tile_5', 'assets/tiles/tileGreen_05.png')
    this.mapLoader.preload()
  }

  create (): void {
    this.developerMenu.create()
    if (this.player == null) {
      this.player = new Player(
        this,
        400,
        0,
        'player'
      )
    }

    if (this.cursors == null) {
      this.cursors = this.input.keyboard.createCursorKeys()
    }

    if (this.platforms == null) {
      this.platforms = this.physics.add.staticGroup()
    }

    this.mapLoader.create(this.platforms)

    this.physics.add.collider(this.player, this.platforms)

    this.mapEditor.create()
  }

  update (): void {
    const onKeyUpListener = (fn: (event: KeyboardEvent) => void) => this.input.keyboard.on('keyup', fn)

    if ((this.player != null) && (this.cursors != null)) {
      this.player.update(this.cursors, onKeyUpListener)
    }

    this.mapEditor.update(this.input.activePointer.worldX, this.input.activePointer.worldY)
  }
}
