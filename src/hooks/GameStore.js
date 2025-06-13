import { create } from 'zustand'

const locationImages = {
  'hospital-room': [
    1,
    'hospital-room.jpeg',
  ],
  'hospital-garden': [
    1,
    'hospital-garden.png',
  ],
}

export const useGameStore = create((set) => ({
  background: 'hospital-room.jpeg',
  location: 'hospital-room',
  moveLocation: (newLocation) => set((state) => ({
    location: newLocation,
    background: locationImages[newLocation][locationImages[newLocation][0]],
  })),
  day: 1,
  nextDay: () => set((state) => ({ day: state.day + 1 })),

  dialog: null,
  setDialog: (newDialog) => set(() => ({ dialog: newDialog })),

  toolbarVisible: true,
}))
