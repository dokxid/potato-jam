import { Ref, ref, watch } from "vue";

export const DEFAULT_SETTINGS = {
    note_min: 0,
    note_max: 36,
    piano_roll_mode: "default",
    debug: false,

    user: {
        display_name: "a potato",
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAMUExURQAAAP/ercawiQAAAA5q4VEAAAAEdFJOU////wBAKqn0AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAEb0lEQVR4Xu2Z3ZbjKAwGZ3fe/50XiTLmRxJg49mL6bpIjMD6ythJzun+9ft/5kfgR+BH4LzArwEmbM4KaN4/HbHDQQEj+yIwOCRgXXmNb3BAQMLDdMULeiuwFC54e/BOwAr/V+C4xjF4I2Beu+YnGFacFrD3PoebBmcFvFuvAhfUwL4HDwXcJ4/oDLWLcwLBk0+0QqlwUICOBmQrlArmPXgg4F9+guwC5cwZgTB/EGgMjgjE+UkgO5RX6soJgUl+2YFyRF2xHoI9gVl8gtwC5cx7ARoFkAsUL14KLFx/gmiFUuGdwFJ8gnCBSsF4CNYF1q4frHThhcBWvstzgTP5xj1YFDiUb2zBmsCx/IcC5/KfCRzMHx+CBYFZvvOJc3giwKke3mfeZl9gfv3fCizlfygQ5xP/oUD8AJK+9RD2BrHAYv6HApxkQ/pe/pbA5BuA+C5/KHRsCKzlM7qg6kusCyx8AxpBuZpgPLAhwBkbkJ2h1rMscOVHzXp0bYFiTxs5E6DXxIBFidqByZ5FgTpf3nTokZcNMNuxJsATeHWaCuTXDp0bWBTQtTRaEEjzLKxgtuOJQELHLscFcv6OAIs4yDDZsSJwfQfRSMgFl2tRfhfSIXMdSwKspZdAxYVV+U14I3DlS4+r3RxWggyZ6JgL3D8CuZdAIYSlgg4o9ywIsPK5QJPfnzwVuPOvnkMPh7w60eZ3Z88EZr/CERJ2QSnXOFYmAm/yM11iOt4TYNkxVKA2iAU+yM8wTIQC729AD/mVQSRwPn9XgDUnIX9J4It8FZBXhn9eQMOrHej+RlKPPngCFNmDSoA0aARYcpo6PhL4agPWBVhhIC2qHpu05z4R0PznAg393+nu4SzfEvDqAV3+LeA/AZqSYFjhTgT4AiwYcWNyeU+gz18Q0JgEwwomFEpTXIHpHWBUw8wN9QhfgAUD2thuLlMN1AOG/DUBpzdTAsdMuAT/tJoIMGjJUw3MeIz5l4CbH0FoDTMORv5JARkz4/CxgMCMjZX/VwmY+a8ERgPqFsYnUHkt0FhQt3Dy3wkQXm0F9RFvA14KDHeB6oCb7wuE+1lDdIKCgZ/vCKRmYcNd/HxTIF+PJ+DPuAT5RaAy0HCBcYs/4xLcgCJQb0HqrylmTJ7ZMojiHYELChVMJChMCS8/UQSKAQEClRvqGWoxs/wiULaA7gqlgpbylEI5YJpfCWBAbyVXbigr2WbCPP8WsAxyoUAV0pC6y0J+JdAa6HseF3SihrrHQnwjcH8S6B8KyIi6w1J+K1AMchbHBS1WULZZ2X6hWXYLmJB7QdVmNb8ViA3IBYo2y/GDQGRAcoaayUZ8LxBuQUqdh6f0nfhRINiDSbKyGz8IiAK9HrCdnhhPeWqwf/GKcdIDgRT+KD1hCWwavEhPWKemhvSeIdkvwgX79BWD99mK0yM1J8fkULjg9pEM4hqkfipciHoNAqfDhVDg3gONPp2txE0lVdMZf8Bc4NP4SOCO/lTBbn2Hf84fivH5EfjbBX7//g8p3X4XQxYOkQAAAABJRU5ErkJggg==",
        color: "#FF6BE8"
    }
}

type DefaultSettings = typeof DEFAULT_SETTINGS
export type SettingKey = keyof DefaultSettings
export type SettingValue<K extends SettingKey> = DefaultSettings[K] 
type SettingRef<K extends SettingKey> = Ref<SettingValue<K>>
type SettingRefs = {[K: string]: SettingRef<any>}

function copyValue(value: any) {
    if(typeof(value) == "object") {
        return structuredClone(value)
    }
    return value
}

export default class SettingsUtil {
    private static settingRefs: SettingRefs = {} as SettingRefs; 

    /** 
     * This turns unknown type values into the correct type for the setting.
     * If not possible then returns the default setting.
     */ 
    private static deserialize<T extends SettingKey>(key: T, value: any): SettingValue<T> {
        let newValue: unknown = value
        const defaultSetting = DEFAULT_SETTINGS[key];
        const defaultType = typeof(defaultSetting);
        if(typeof(value) !== defaultType) {
            try {
                switch(defaultType) {
                    case "number":
                        newValue = Number(value)
                        break;
                    case "boolean":
                        newValue = value.toString().toLowerCase() == "true" ? true : false
                        break;
                    case "object":
                        newValue = JSON.parse(value.toString());
                        break;
                    case "string":
                        newValue = value.toString();
                        break;
                    case "bigint":
                        newValue = BigInt(value);
                        break;
                    default: 
                        throw new Error("Unserializable default setting type!");
                }
            } catch(err) {
                newValue = copyValue(defaultSetting);
                console.warn(`Could not set ${key} to`, value, "and used default setting instead!", err)
            }
        }
        return newValue as SettingValue<T>;
    }

    /**
     * This gets a Vue ref that will be updated whenever the setting is changed.
     * The ref's value can also be changed to change the stored setting. 
    */ 
    public static getRef<K extends SettingKey>(key: K): SettingRef<K> {
        let sref = SettingsUtil.settingRefs[key] as (SettingRef<K> | undefined)
        if(sref === undefined) {
            let defaultSetting = copyValue(DEFAULT_SETTINGS[key])
            let stored = localStorage.getItem(key)
            sref = ref(stored == null ? defaultSetting : SettingsUtil.deserialize(key, stored)) as SettingRef<K>
            watch(sref, (newSetting) => {
                localStorage.setItem(key, typeof(newSetting) == "object" ? JSON.stringify(newSetting) : newSetting.toString());
            })
            SettingsUtil.settingRefs[key] = sref
        }
        return sref;
    }

    static set<K extends SettingKey>(key: K, value: SettingValue<K>) {
        let ref = SettingsUtil.getRef(key)
        let newValue = SettingsUtil.deserialize(key, value);
        ref.value = newValue;
    }

    static get<K extends SettingKey>(key: K) {
        let ref = SettingsUtil.getRef(key)
        return ref.value
    }

    static reset() {
        localStorage.clear()
        for(let k in SettingsUtil.settingRefs) {
            let key = k as SettingKey
            SettingsUtil.getRef(key).value = copyValue(DEFAULT_SETTINGS[key])
        }
    }
}