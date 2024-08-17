import EventEmitter from "eventemitter3";
import { ClientKeyboardPayload, ClientSwitchInstrumentPayload, NoteEventPayload } from "./sound/SoundHandler";
import { KeyboardPayload, SwitchInstrumentPayload } from "./net/PotatoServer";

type MainEvents = {
    "handlerInitialized": () => void
    // This one can be send by both the local client and remote clietns
    "notePayload": (payload: NoteEventPayload) => void
    // This one will ONLY be sent by the local client!!
    "userNotePayload": (payload: NoteEventPayload) => void
    "remoteSwitchInstrumentPayload": (payload: SwitchInstrumentPayload) => void
    "userSwitchInstrumentPayload": (payload: ClientSwitchInstrumentPayload) => void
    "remoteKeyboardPayload": (payload: KeyboardPayload) => void
    "userKeyboardPayload": (payload: ClientKeyboardPayload) => void
}

class MainEventHandler extends EventEmitter<MainEvents> {
    constructor() {
        super();
    }

    sendHandlerInitialized() {
        this.emit("handlerInitialized")
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

    sendRemoteKeyboardPayload(payload: KeyboardPayload) {
        console.log("sending remote keyboard payload")
        this.emit("remoteKeyboardPayload", payload)
    }

    sendUserKeyboardPayload(payload: ClientKeyboardPayload) {
        console.log("sending keyboard change")
        this.emit("userKeyboardPayload", payload)
    }
}

export default new MainEventHandler()