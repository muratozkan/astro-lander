import { Input, Scene } from "phaser"

export default class extends Scene {
    constructor() {
        super({ key: "FlyScene" })
    }

    preload() {
        this.anims.create({
            key: "lander-engine-start",
            framerate: 1,
            repeat: 1,
            frames: this.anims.generateFrameNumbers("lander", {
                frames: [0, 1, 2]
            })
        })
        this.anims.create({
            key: "lander-engine-on",
            framerate: 1,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("lander", {
                frames: [3, 3, 3, 4, 4]
            }),
            yoyo: true
        })
    }

    create() {
        // player
        const lander = this.add.sprite(30, 30, "lander", 0)

        this.physics.add.existing(lander)
        lander.body.setAllowRotation(true)
        lander.body.setGravityY(100)
        lander.body.setBounce(0.05)
        lander.body.setOffset(0, -4)

        // map
        // const heightMap = this.cache.text.get("level-1").split(",")

        const width = this.game.renderer.width
        const height = this.game.renderer.height
        const ground = this.add.group()
        for (var x = 0; x < width; x += 32) {
            const groundBlock = this.add.sprite(x, height - 32, "ground")
            this.physics.add.existing(groundBlock, true)
            ground.add(groundBlock)
        }

        this.physics.add.existing(ground)
        this.physics.add.collider(lander, ground)

        this.controls = this.input.keyboard.addKeys({
            rotateLeft: Input.Keyboard.KeyCodes.A,
            rotateRight: Input.Keyboard.KeyCodes.D,
            engine: Input.Keyboard.KeyCodes.W
        })

        // expose local variables
        this.engine = {
            starting: false,
            on: false,
            stopping: false
        }
        this.lander = lander
        this.ground = ground
    }

    update() {
        const self = this

        this.physics.collide(this.lander, this.ground)

        if (this.controls.engine.isDown) {
            this.engine.starting = !this.engine.on
        } else if (this.controls.engine.isUp) {
            this.engine.starting = false
            this.engine.stopping = this.engine.on
        }

        if (this.lander.body.onFloor()) {
            this.lander.body.setAngularVelocity(0)
            this.lander.body.setVelocity(0, 0)
        } else {
            let ang_acc = 0
            if (this.controls.rotateLeft.isDown) {
                ang_acc = -180
            } else if (this.controls.rotateRight.isDown) {
                ang_acc = 180
            } else if (this.controls.rotateLeft.isUp && this.controls.rotateRight.isUp) {
                ang_acc = 0
            }

            this.lander.body.setAngularAcceleration(ang_acc)
        }

        if (this.engine.on) {
            const angle = this.lander.body.rotation * Math.PI / 180
            this.lander.body.setAcceleration(Math.sin(angle) * 200, -Math.cos(angle) * 200)
        } else {
            this.lander.body.setAcceleration(0, 0)
        }

        // Engine starting & stopping animation
        if (this.engine.starting) {
            this.lander
                .play("lander-engine-start", true)
                .once("animationcomplete", () => {
                    if (!self.engine.stopping) {
                        self.engine.on = true
                        self.lander.play("lander-engine-on", true)
                    }
                })
        } else if (this.engine.stopping) {
            this.lander.anims.stop()
            this.lander.anims
                .playReverse("lander-engine-start")
                .once("animationcomplete", () => {
                    self.engine.stopping = false
                    self.engine.on = false
                })
        }
    }
}
