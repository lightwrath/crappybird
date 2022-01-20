import BaseScene from "./BaseScene"

export default class MenuScene extends BaseScene {
  constructor(config) {
    super("MenuScene", config)
    this.menu = [
      {
        scene: "PlayScene",
        text: "Play"
      },
      {
        scene: "ScoreScene",
        text: "Score"
      },
      {
        scene: null,
        text: "Exit"
      }
    ]
  }

  setupMenuEvents(menuItem) {
    const textGameObject =  menuItem.textGameObject
    menuItem.textGameObject.setInteractive()
    menuItem.textGameObject.on('pointerover', () => {
      menuItem.textGameObject.setStyle({
        fill: '#ff0'
      })
    })
    menuItem.textGameObject.on('pointerout', () => {
      menuItem.textGameObject.setStyle({
        fill: '#fff'
      })
    })

    menuItem.textGameObject.on('pointerup', () => {
      menuItem.scene && this.scene.start(menuItem.scene)
      if (menuItem.text === "Exit") {
        this.game.destroy(true)
      }
    })
  }

  create() {
    super.create()
    this.createMenu(this.menu, this.setupMenuEvents.bind(this))
  }

}
