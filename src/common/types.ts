declare global {
  interface Window {
    UIkit: any
  }
}

export interface SettingsActions {
  NONE: number
  ADD_EDUCATION: number
  UPDATE_EDUCATION: number
  ADD_WORK: number
  UPDATE_WORK: number
  ADD_ADDRESS: number
  UPDATE_ADDRESS: number
}
