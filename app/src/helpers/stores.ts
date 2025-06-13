import {readable, writable} from 'svelte/store'

import {DefaultStorage} from './storage'
import {DefaultRemote} from '../../../core/remotes'
import {DefaultSync} from '../../../core/syncs'

export const storage = readable(new DefaultStorage())

export const sync = readable(new DefaultSync(new DefaultRemote(), new DefaultStorage()))

export const currentName = writable('')

export enum ModalShown {
    None,
    QRScan,
    Help
}

export const modalShown = writable(ModalShown.None)