import type {Talk} from "../storage";

export type FocusableTarget = HTMLTextAreaElement | HTMLInputElement

export const HIDDEN_KEYS = ['id', '__revision'];

export const getTalkName = (talk: Talk) => {
    return talk.title || talk.Title || talk.id;
}

export const publicKeysOnly = (key: string) => !HIDDEN_KEYS.includes(key);

export const isElementVisible = (el: Element) => {
    const style = window.getComputedStyle(el);
    return !((style.display === 'none') || (style.visibility === 'hidden'))
}

export const simulateInput = (element: FocusableTarget, text: string) => {
    element.focus()
    element.select()
    try {
        document.execCommand("insertText", false, text)
    } catch (e) {
        console.error("is document.execCommand already disabled in your browser? Tough luck.", e);
    }
}