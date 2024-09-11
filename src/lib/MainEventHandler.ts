import EventEmitter from "eventemitter3";
import { NoteEventPayload } from "./SoundHandler";


export type MIDINotePayload = {note: number, event: "pressed" | "released"}

type MainEvents = {
    // This one can be send by both the local client and remote clietns
    "notePayload": (payload: NoteEventPayload) => void
    // This one will ONLY be sent by the local client!!
    "userNotePayload": (payload: NoteEventPayload) => void
    // This one is sent by MIDI input devices
    "userMIDINotePayload": (payload: MIDINotePayload) => void
}

class MainEventHandler extends EventEmitter<MainEvents> {
    constructor() {
        super();
    }

    sendNotePayload(payload: NoteEventPayload) {
        this.emit("notePayload", payload);
    }

    sendUserNotePayload(payload: NoteEventPayload) {
        this.emit("userNotePayload", payload);
    }

    sendUserMIDINotePayload(payload: MIDINotePayload) {
        this.emit("userMIDINotePayload", payload)
    }
}

export default new MainEventHandler()