import { Scene } from "phaser"

export default class extends Scene {
    constructor() {
        super({ key: "TitleScene" })
    }

    preload() {
        this.load.spritesheet("lander", "assets/lander.png", {
            frameWidth: 32,
            frameHeight: 38
        })
        this.load.spritesheet("ground", "assets/ground.png", {
            frameWidth: 32
        })
        this.load.text("level-1", "assets/levels/level_1.txt")
    }

    create() {
        this.scene.start("FlyScene")
    }

    update() {}
}
