import EventEmitter from "eventemitter3";
import { NoteEventPayload, SwitchInstrumentPayload } from "./SoundHandler";

type MainEvents = {
    // This one can be send by both the local client and remote clietns
    "notePayload": (payload: NoteEventPayload) => void
    // This one will ONLY be sent by the local client!!
    "userNotePayload": (payload: NoteEventPayload) => void

    "switchInstrumentPayload": (payload: SwitchInstrumentPayload) => void
    "userSwitchInstrumentPayload": (payload: SwitchInstrumentPayload) => void
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

    sendSwitchInstrumentPayload(payload: SwitchInstrumentPayload) {
        this.emit("switchInstrumentPayload", payload)
    }

    sendUserSwitchInstrumentPayload(payload: SwitchInstrumentPayload) {
        this.emit("userSwitchInstrumentPayload", payload)
    }
}

export default new MainEventHandler()