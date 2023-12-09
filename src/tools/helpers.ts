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

const selectElementContents = (element: Element) => {
    var range = document.createRange();
    range.selectNodeContents(element);
    var sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
}

export const simulateInput = (element: FocusableTarget, text: string) => {
    try {
        element.focus()
        try {
            element.select()
        } catch (e) {
            selectElementContents(element)
        }

        try {
            document.execCommand("insertText", false, text)
            return true
        } catch (e) {
            console.error("is document.execCommand already disabled in your browser? Tough luck.", e);
            return false
        }
    } catch (e) {
        console.warn("Can't write into this element as it is not focusable", element, e);
        return false
    }
}