import EventEmitter from "eventemitter3";
import { NoteEventPayload } from "./SoundHandler";

type MainEvents = {
    "notePayload": (payload: NoteEventPayload) => void
}

class MainEventHandler extends EventEmitter<MainEvents> {
    constructor() {
        super();
    }

    sendNotePayload(payload: NoteEventPayload) {
        this.emit("notePayload", payload);
    }
}

export default new MainEventHandler()