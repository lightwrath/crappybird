import Phaser from "phaser"

export default class BaseScene extends Phaser.Scene {
  constructor(key, config) {
    super(key)
    this.config = config
    this.screenCenter = [config.width / 2, config.height / 2]
    this.fontOptions = {
      fontSize: '42px',
      fill: '#fff'
    }
  }

  createMenu() {
    menu.forEach(menuItem => {
      const menuPosition = []
    })
  }

  create() {
    this.add.image(0, 0, "sky").setOrigin(0)
    if (this.config.canGoBack) {
      const backButton = this.add.image(this.config.width - 10, this.config.height - 10, "back")
        .setOrigin(1)
        .setScale(2)
        .setInteractive()
      backButton.on('pointerup', () => {
        this.scene.start("MenuScene")
      })
    }
  }

  createMenu(menu, setupMenuEvents) {
    let menuListCount = 1
    menu.forEach(menuItem => {
      const menuPosition = [...this.screenCenter]
      menuItem.textGameObject = this.add.text(
        this.screenCenter[0],
        this.screenCenter[1] + (menuListCount * 32),
        menuItem.text, this.fontOptions
      )
      menuItem.textGameObject.setOrigin(0.5, 1)
      menuListCount++
      setupMenuEvents(menuItem)
    })
  }
}
