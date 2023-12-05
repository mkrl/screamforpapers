import type {Talk} from "../storage";

export const HIDDEN_KEYS = ['id', '__revision'];

export const getTalkName = (talk: Talk) => {
    return talk.title || talk.Title || talk.id;
}

export const publicKeysOnly = (key: string) => !HIDDEN_KEYS.includes(key);