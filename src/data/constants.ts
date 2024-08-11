export const constants = {
    SEMITONE_NAMES: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
    KEYBINDS: ["A", "W", "S", "E", "D", "F", "T", "G", "Y", "H", "U", "J"], // they got that uauuigug au ui i o[] <--
    HEPTATONIC_SCALES: [
        {
            name: "diatonic",
            content: [0, 2, 4, 5, 7, 9, 11],
        },
        {
            name: "melodic minor",
            content: [0, 2, 3, 5, 7, 9, 11],
        },
        {
            name: "harmonic minor",
            content: [0, 2, 3, 5, 7, 8, 11],
        },
        {
            name: "harmonic major",
            content: [0, 2, 4, 5, 7, 8, 11],
        },
    ]
}