import { writable } from 'svelte/store'

export const filterStore = writable({
  selectedArtist: '',
  selectedAuthor: '',
  selectedPublisher: '',
  yearFrom: '',
  yearTo: '',
  searchFilter: ''
})