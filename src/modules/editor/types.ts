export type EditorScene = {
  display: {
    title: string
  }
  owner: string
  contact: {
    name: string
    email: string
  }
  scene: {
    parcels: string[]
    base: string
  }
  communications: {
    type: string
    signalling: string
  }
  policy: {
    fly: boolean
    voiceEnabled: boolean
    blacklist: string[]
    teleportPosition: string
  }
  main: string
  _mappings: Record<string, string>
}
