export type NonEmptyArray<T> = [T, ...T[]]

export interface LayoutAPIResponse {
  menu: Menu
  page: {
    seo: SEO
  }
  uri: string
}

export interface Menu {
  menuItems: {
    nodes: MenuItem[] // You already have MenuItem defined
  }
}

// Assuming SEO structure needs to be defined based on your new data
export interface SEO {
  metaDesc: string
  metaKeywords: string
  opengraphSiteName: string
  opengraphTitle: string
  opengraphPublisher: string
  opengraphUrl: string
  title: string
  twitterDescription: string
  twitterTitle: string
  twitterImage: ImageObject | null // Adjust based on your actual data
  opengraphImage: ImageObject | null
}

// Adjust or extend MediaDetails and MediaSize if necessary to match the new structure

export interface HomePageContentResponse {
  page: {
    id: string
    editorBlocks: EditorBlock[]
  }
}

export interface MenuItem {
  label: string
  order: number
  uri: string
  current: boolean
}

export interface CoreButtonsAttributes extends Attributes {
  layout: {
    justifyContent: 'space-between' | 'left' | 'right' | 'center'
    type: 'flex'
  }
}

export interface CoreButtonsBlock extends EditorBlock {
  name: 'core/buttons'
  attributes: CoreButtonsAttributes
  children: CoreButtonBlock[]
}

export interface CoreButtonAttributes extends Attributes {
  linkTarget?: '_blank' | '_self' | '_parent' | '_top'
  text?: string
  url?: string
  fontSize?: string | null
  align?: 'full' | 'wide ' | 'center' | 'right' | '' | null
}

export interface CoreButtonBlock extends EditorBlock {
  name: 'core/button'
  attributes: CoreButtonAttributes
  children: [] // CoreButtonBlock does not have children
}

export interface EditorBlock {
  name: string
  parentClientId: string | null
  clientId: string
  attributes: Attributes
  children?: EditorBlock[]
}

export interface Attributes {
  backgroundColor?: string
  content?: string
  fontFamily?: string | null
  fontSize?: string | null
  textColor?: string | null
  textAlign?: string | null
  align?: 'full' | 'wide ' | 'center' | 'right' | '' | null
  alignment?: 'full' | 'wide ' | 'center' | 'right' | '' | null
  level?: number | null
  height?: string
  layout?: Layout | string | null
  style?: string | null
}

export interface Layout {
  type: string
  justifyContent: string
}

export interface NameAndSlug {
  slug: string
  name: string
}

// Enum for known size names
export type ImageSizeName = 'medium' | 'large' | 'thumbnail' | 'medium_large' | '1536x1536' | '2048x2048'

// More specific ImageSize type with width and height as numbers and name as enum
export type ImageSize = {
  name: ImageSizeName
  sourceUrl: string
  width: number // Assuming you might want to process these as numbers
  height: number
}

export type MediaSize = {
  sourceUrl: string
  width: number
  height: number
  name: ImageSizeName
}

export type MediaDetails = {
  sizes: NonEmptyArray<MediaSize>
}

export type ImageObject = {
  altText: string
  caption: string | null
  mediaDetails: MediaDetails
  // Add optional properties here if needed
}
