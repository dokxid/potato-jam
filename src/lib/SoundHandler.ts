// i dont know what to name these help

import * as Tone from "tone";


export default class SoundHandler {
    
    player: Tone.Player
    divisions: number
    loaded: boolean

    constructor() {
        Tone.start()
        this.player = new Tone.Player("src/assets/meow.ogg", onload=() => {this.set_loaded()}).toDestination();
        this.divisions = 12
        this.loaded = false
    }

    set_loaded() {
        this.loaded = true
    }

    get_pitch(pitch: number) {
        return 2**(pitch/this.divisions)
    }

    async play(event: string, pitch: number) {
        console.log(this.loaded)
        Tone.start()
        if (this.loaded) {
            if (event === "pressed")
                this.press(pitch)
            else
                this.release(pitch)
        }
    }

    async press(pitch: number) {
        this.player.playbackRate = this.get_pitch(pitch)
        // this.player.stop()
        await this.player.start()
    }
    async release(pitch: number) {
        await this.player.stop(this.get_pitch(pitch))
        //await this.player.
    }

    


}