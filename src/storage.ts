type TalkMeta = {
  id: string
  title?: string
  Title?: string
  __revision: {
    link: string
    sha: string
  }
}

export type Talk = {
  [key: string]: string
} & TalkMeta

export enum SubmissionStatus {
  PENDING,
  APPROVED,
  REJECTED,
}

export type TalkSubmission = {
  id: string
  date: string
  name: string
  url: string
  sha: string
  status?: SubmissionStatus
}

export type WishlistItem = {
  dateEnds: string
  name: string
  url: string
  done: boolean
}

type PersonalInfoMeta = {
  name?: string
  email?: string
}

export type PersonalInfo = {
  [key: string]: string
} & PersonalInfoMeta

type SyncExtensionStorage = {
  token: string | null
  repo: string | null
}

export type LocalExtensionStorage = {
  lastSyncedAt?: string
  personalInfo?: PersonalInfo
  talkList?: Talk[]
  submissions?: TalkSubmission[]
  wishlist?: WishlistItem[]
  selectedTalk?: string
}

const defaultSyncStorage: SyncExtensionStorage = {
  token: null,
  repo: null,
}

const defaultLocalStorage: LocalExtensionStorage = {
  lastSyncedAt: 'never',
  personalInfo: {},
  talkList: [],
  wishlist: [],
  submissions: [],
  selectedTalk: '',
}

export const storageSync = {
  get: (): Promise<SyncExtensionStorage> =>
    chrome.storage.sync.get(
      defaultSyncStorage
    ) as Promise<SyncExtensionStorage>,
  set: (value: SyncExtensionStorage): Promise<void> =>
    chrome.storage.sync.set(value),
}

export const storageLocal = {
  get: (): Promise<LocalExtensionStorage> =>
    chrome.storage.local.get(
      defaultLocalStorage
    ) as Promise<LocalExtensionStorage>,
  set: (value: LocalExtensionStorage): Promise<void> =>
    chrome.storage.local.set(value),
}
