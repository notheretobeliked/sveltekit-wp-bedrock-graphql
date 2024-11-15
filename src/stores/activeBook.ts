import { writable } from 'svelte/store'

export const activeBook = writable<string | null>(null)