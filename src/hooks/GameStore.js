import { create } from 'zustand'
import dialogData from '../assets/data/dialog.json'
import locationData from '../assets/data/locations.json'

export const useGameStore = create((set) => ({
  background: 'hospital-room.jpeg',
  setBackground: (newBackground) => set(()=>({background: newBackground})),
  location: 'hospital-room',
  moveLocation: (newLocation) => set(() => ({
    location: newLocation,
    background: locationData[newLocation][locationData[newLocation][0]],
  })),
  getLocations: Object.keys(locationData),
  pixelated: true,

  day: 13,
  nextDay: () => set((state) => ({ day: state.day + 1 })),
  advanceDay: (days) => set((state) => ({ day: state.day + days })),

  mode: "vn",
  setMode: (newMode) => set(() => ({ mode: newMode })),

  handleAction: (action) => set((state) => {
    const a = action.action
    if (a === 'next-day') {
      state.nextDay()
    }
    else if (a === 'advance-day') {
      state.advanceDay(action.value)
    }
    else if (a === 'move-location') {
      state.moveLocation(action.value)
    }
    else if (a === 'dialog') {
      state.setDialog(dialogData[action.value])
    }
    else if (a === 'social-link') {
      state.setDialog(action.value)
    }
    else if (a === 'go-to-dungeon') {
      state.setMode("battle")
    }
    return {}
  }),

  dialog: null,
  setDialog: (newDialog) => set(() => ({ dialog: newDialog })),

  toolbarVisible: true,
}))
