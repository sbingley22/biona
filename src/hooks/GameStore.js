import { create } from 'zustand'

const locationImages = {
  'hospital-room': [
    1,
    'hospital-room.jpeg',
  ],
  'hospital-nurses-station': [
    1,
    'hospital-nurses-station.jpeg',
  ],
  'hospital-ward-a': [
    1,
    'hospital-ward-a.jpeg',
  ],
  'hospital-ward-b': [
    1,
    'hospital-ward-b.jpeg',
  ],
  'hospital-garden': [
    1,
    'hospital-garden.png',
  ],
}

export const useGameStore = create((set) => ({
  background: 'hospital-room.jpeg',
  setBackground: (newBackground) => set(()=>({background: newBackground})),
  location: 'hospital-room',
  moveLocation: (newLocation) => set(() => ({
    location: newLocation,
    background: locationImages[newLocation][locationImages[newLocation][0]],
  })),
  getLocations: Object.keys(locationImages),
  pixelated: true,

  day: 1,
  nextDay: () => set((state) => ({ day: state.day + 1 })),
  advanceDay: (days) => set((state) => ({ day: state.day + days })),

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
    return {}
  }),

  dialog: null,
  setDialog: (newDialog) => set(() => ({ dialog: newDialog })),

  toolbarVisible: true,
}))
