type ScaleMap = {
    [name: string]: Array<number>
}

const scale_map: ScaleMap = {}
scale_map['no scale highlight'] =
    []
scale_map['diatonic'] =
    [0, 2, 4, 5, 7, 9, 11]
scale_map['melodic minor'] =
    [0, 2, 3, 5, 7, 9, 11]
scale_map['harmonic minor'] =
    [0, 2, 3, 5, 7, 8, 11]
scale_map['harmonic major'] =
    [0, 2, 4, 5, 7, 8, 11]

export const constants = {
    SEMITONE_NAMES: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
    KEYBINDS: ["A", "W", "S", "E", "D", "F", "T", "G", "Y", "H", "U", "J"], // they got that uauuigug au ui i o[] <--
    SCALES: scale_map
}