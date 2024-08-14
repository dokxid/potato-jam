import EventEmitter from "eventemitter3";
import { ClientSwitchInstrumentPayload, NoteEventPayload } from "./SoundHandler";
import { SwitchInstrumentPayload } from "./net/PotatoServer";

type MainEvents = {
    // This one can be send by both the local client and remote clietns
    "notePayload": (payload: NoteEventPayload) => void
    // This one will ONLY be sent by the local client!!
    "userNotePayload": (payload: NoteEventPayload) => void
    "remoteSwitchInstrumentPayload": (payload: SwitchInstrumentPayload) => void
    "userSwitchInstrumentPayload": (payload: ClientSwitchInstrumentPayload) => void
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

    sendRemoteSwitchInstrumentPayload(payload: SwitchInstrumentPayload) {
        this.emit("remoteSwitchInstrumentPayload", payload);
    }

    sendUserSwitchInstrumentPayload(payload: ClientSwitchInstrumentPayload) {
        this.emit("userSwitchInstrumentPayload", payload)
    }
}

export default new MainEventHandler()