export const constants = {
    SEMITONE_NAMES: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
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