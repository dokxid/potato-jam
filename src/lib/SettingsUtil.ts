import { Ref, ref, watch } from "vue";

export const DEFAULT_SETTINGS = {
    note_min: 0,
    note_max: 36,
    piano_roll_mode: "default",
    debug: false
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