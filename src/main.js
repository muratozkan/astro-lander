import Phaser, { Game } from "phaser"
import TitleScene from "./scenes/TitleScene"
import FlyScene from "./scenes/FlyScene"

const config = {
    type: Phaser.WEBGL,
    parent: "content",
    width: window.innerWidth,
    height: window.innerHeight,
    scene: [TitleScene, FlyScene],
    physics: {
        default: "arcade",
        arcade: {
            debug: true
        }
    }
}

const game = new Game(config)

window.onresize = function() {
    game.renderer.resize(window.innerWidth, window.innerHeight)
    game.events.emit("resize")
}
