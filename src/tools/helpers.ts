import type { Talk, TalkSubmission, WishlistItem } from '../storage'

export type FocusableTarget = HTMLTextAreaElement | HTMLInputElement

export const HIDDEN_KEYS = ['id', '__revision']

export const getTalkName = (talk: Talk) => {
  return talk.title || talk.Title || talk.id
}

export const publicKeysOnly = (key: string) => !HIDDEN_KEYS.includes(key)

export const isElementVisible = (el: Element) => {
  const style = window.getComputedStyle(el)
  return !(style.display === 'none' || style.visibility === 'hidden')
}

const selectElementContents = (element: Element) => {
  var range = document.createRange()
  range.selectNodeContents(element)
  var sel = window.getSelection()
  sel?.removeAllRanges()
  sel?.addRange(range)
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
      document.execCommand('insertText', false, text)
      return true
    } catch (e) {
      console.error(
        'is document.execCommand already disabled in your browser? Tough luck.',
        e
      )
      return false
    }
  } catch (e) {
    console.warn(
      "Can't write into this element as it is not focusable",
      element,
      e
    )
    return false
  }
}

export const replaceShaInUrl = (url: string, newSha: string) => {
  const regex = /\/blob\/[0-9a-f]+\// // Regular expression to match the SHA string

  return url.replace(regex, `/blob/${newSha}/`)
}

export const validateSubmissions = (submissions: TalkSubmission[]) => {
  return submissions.filter((submission) => {
    const { id, date, name, url, sha } = submission
    return id && date && name && url && sha
  })
}
export const validateWishlist = (list: WishlistItem[]) => {
  return list.filter((item) => {
    const { dateEnds, name, url } = item
    return dateEnds && name && url
  })
}

const ONE_DAY = 1000 * 60 * 60 * 24
const ONE_WEEK = ONE_DAY * 7

// Take two dates and return the corresponding tailwindcss color class depending on the difference between them
export const getDueDateColor = (date: Date, dateEnds: Date) => {
  const diff = dateEnds.getTime() - date.getTime()
  if (diff < 0) {
    return 'text-gray-500'
  }
  if (diff < ONE_DAY * 2) {
    return 'text-red-500'
  }
  if (diff < ONE_WEEK * 2) {
    return 'text-yellow-500'
  }
  return 'text-green-500'
}

export const isEventInElement = (e: MouseEvent, element: Element) => {
  const rect = element.getBoundingClientRect()
  const x = e.clientX
  if (x < rect.left || x >= rect.right) {
    return false
  }
  const y = e.clientY
  return !(y < rect.top || y >= rect.bottom)
}
