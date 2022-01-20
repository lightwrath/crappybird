import BaseScene from "./BaseScene"

export default class ScoreScene extends BaseScene {
  constructor(config) {
    super("ScoreScene", {
      ...config,
      canGoBack: true
    })
  }

  create() {
    super.create()
    this.add.text(
      ...this.screenCenter,
      `Highest Score: ${localStorage.getItem("bestScore")}`,
      this.fontOptions
    )
      .setOrigin(0.5, 1)
  }
}
