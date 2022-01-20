import Phaser from 'phaser'
import PreloadScene from "./scenes/PreloadScene"
import MenuScene from "./scenes/MenuScene"
import PlayScene from "./scenes/PlayScene"
import ScoreScene from "./scenes/ScoreScene"
import PauseScene from "./scenes/PauseScene"

const WIDTH = 800
const HEIGHT = 600

const sharedConfig = {
  width: WIDTH,
  height: HEIGHT,
  startPosition: {
    x: WIDTH * 0.1,
    y: HEIGHT /2
  }
}

const Scenes = [
  PreloadScene,
  MenuScene,
  ScoreScene,
  PlayScene,
  PauseScene,
]

const initScenes = () => Scenes.map(Scene => new Scene(sharedConfig))

const config = {
  type: Phaser.AUTO,
  ...sharedConfig,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      //debug: true
    }
  },
  scene: initScenes()
}

new Phaser.Game(config)
