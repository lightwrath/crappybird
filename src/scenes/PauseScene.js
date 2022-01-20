import BaseScene from "./BaseScene"

export default class PauseScene extends BaseScene {
  constructor(config) {
    super("PauseScene", config)
    this.menu = [
      {
        scene: "PlayScene",
        text: "Continue"
      },
      {
        scene: "MenuScene",
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
      if (menuItem.scene && menuItem.text === "Continue") {
        this.scene.stop()
        this.scene.resume(menuItem.scene)
      } else {
        this.scene.stop("PlayScene")
        this.scene.start("MenuScene")
      }
    })
  }

  create() {
    super.create()
    this.createMenu(this.menu, this.setupMenuEvents.bind(this))
  }

}
