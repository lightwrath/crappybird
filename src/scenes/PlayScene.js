import BaseScene from "./BaseScene"

export default class PlayScene extends BaseScene{
  constructor(config) {
    super("PlayScene", config)
    this.initialPosition = {x: 40, y: 300 }
    this.bird = null
    this.pipes = null
    this.birdVelocity = 200
    this.score = 0
    this.scoreText = ""
    this.isPaused = false
  }

  flap() {
    if (this.isPaused) return;
    this.bird.body.velocity.y -= this.birdVelocity
  }

  setPipePosition(upperPipe, lowerPipe) {
    const addDifficultyMultiplier = (num) => num - (this.score * 3)
    const pipeGapSize = Phaser.Math.Between(addDifficultyMultiplier(200), addDifficultyMultiplier(300))
    const pipeGapPosition = Phaser.Math.Between(20, 580 - pipeGapSize)
    const pipeYDistance = Phaser.Math.Between(addDifficultyMultiplier(400), addDifficultyMultiplier(500))
    const xOffSet = this.getRightMostPipe()

    upperPipe.x = pipeYDistance + xOffSet
    upperPipe.y = pipeGapPosition
    upperPipe.setOrigin(0, 1)
    upperPipe.setImmovable(true)

    lowerPipe.x = pipeYDistance + xOffSet
    lowerPipe.y = pipeGapPosition + pipeGapSize
    lowerPipe.setOrigin(0)
    lowerPipe.setImmovable(true)
  }

  getRightMostPipe() {
    let rightMostX = 0
    this.pipes.getChildren().forEach(pipe => (rightMostX = Math.max(pipe.x, rightMostX) ))
    return rightMostX
  }

  recyclePipes() {
    const outOfBoundsPipes = []
    this.pipes.getChildren().forEach(pipe => {
      if (pipe.getBounds().right < 0) outOfBoundsPipes.push(pipe)
    })
    if (outOfBoundsPipes.length > 1) {
      this.setPipePosition(...outOfBoundsPipes)
      this.increaseScore()
    }
  }

  gameOver() {
    this.physics.pause()
    this.bird.setTint(0xff0000)

    this.time.addEvent({
      delay: 1000,
      callback: () => this.scene.restart(),
      loop: false
    })
  }

  createBird() {
    this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, 'bird')
    this.bird.setOrigin(0)
    this.bird.setScale(2)
    this.bird.setFlipX(true)
    this.bird.setBodySize(this.bird.width, this.bird.height - 8)
    this.bird.body.gravity.y = 200

    this.bird.setCollideWorldBounds(true)
  }

  createPipes() {
    this.pipes = this.physics.add.group()
    for (let y = 0; y < 5; y++) {
      const upperPipe = this.pipes.create(0, 0, 'pipe')
      const lowerPipe = this.pipes.create(0, 0, 'pipe')
      this.setPipePosition(upperPipe, lowerPipe)
    }
    this.pipes.setVelocityX(-200)
  }

  createUI() {
    this.isPaused = false
    const pauseButton = this.add.image(this.config.width - 10, this.config.height - 10, 'pause')
      .setOrigin(1)
      .setScale(2)
      .setInteractive()
    pauseButton.on('pointerdown', () => {
      this.isPaused = true
      this.physics.pause()
      this.scene.pause()
      this.scene.launch("PauseScene")
    }, this)
  }

  createColliders() {
    this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this)
  }

  createScore() {
    this.score = 0
    const bestScore = localStorage.getItem("bestScore")
    this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, {
      fontSize: '32px',
      fill: '#000'
    })
    this.add.text(16, 52, `Best Score: ${bestScore || 0}`, {
      fontSize: '18px',
      fill: '#000'
    })
  }

  increaseScore() {
    this.score++
    this.scoreText.setText(`Score: ${this.score}`)

    const currentBestScoreText = localStorage.getItem('bestScore')
    const currentBestScore = currentBestScoreText && parseInt(currentBestScoreText, 10)
    if (!currentBestScore || this.score > currentBestScore) {
      localStorage.setItem('bestScore', this.score)
    }
  }

  initialiseInputs() {
    this.input.keyboard.on('keydown_SPACE', this.flap, this)
  }

  listenToEvents() {
    if (this.pauseEvent) return;
    this.pauseEvent = this.events.on("resume", () => {
      let seconds = 3
      function countDownCallbackFunction() {
        seconds--
        this.countDownText.setText(`Fly in ${seconds}`)
        if (seconds <= 0) {
          this.isPaused = false
          this.countDownText.setText("")
          console.log(this.countDownText)
          this.physics.resume()
          this.timedEvent.remove()
        }
      }
      this.countDownText = this.add.text(...this.screenCenter, `Fly in ${seconds}`, this.fontOptions)
      this.timedEvent = this.time.addEvent({
        delay: 1000,
        callback: countDownCallbackFunction,
        callbackScope: this,
        loop: true
      })
    })
  }

  checkGameStatus() {
    if (this.bird.getBounds().bottom >= this.config.height || this.bird.y <= 0) {
      this.gameOver()
    }
  }

  create() {
    super.create()
    this.createBird()
    this.createPipes()
    this.createColliders()
    this.createScore()
    this.initialiseInputs()
    this.createUI()
    this.listenToEvents()

    this.anims.create({
      key: 'flying',
      frames: this.anims.generateFrameNumbers("bird", {
        start: 8,
        end: 15
      }),
      frameRate: 8,
      repeat: -1
    })
    this.bird.play('flying')
  }

  update() {
    this.checkGameStatus()
    this.recyclePipes()
  }
}
