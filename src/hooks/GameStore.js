import { create } from 'zustand'
import dialogData from '../assets/data/dialog.json'
import locationData from '../assets/data/locations.json'
import alliesData from '../assets/data/allies.json'
import stages from '../assets/data/stages.json'

const defaultPartyStats = {
  'sean': {
    biona: "nk-cell",
    health: 50,
    maxHealth: 50,
    energy: 30,
    maxEnergy: 30,
    nerfs: [],
    buffs: [],
  },
  'sofia': {
    biona: "nk-cell",
    health: 45,
    maxHealth: 45,
    energy: 60,
    maxEnergy: 60,
    nerfs: [],
    buffs: [],
  },
  'boy': {
    biona: "nk-cell",
    health: 60,
    maxHealth: 60,
    energy: 60,
    maxEnergy: 60,
    nerfs: [],
    buffs: [],
  },
}

export const useGameStore = create((set) => ({
  background: 'hospital-room.jpeg',
  setBackground: (newBackground) => set(()=>({background: newBackground})),
  location: 'hospital-room',
  moveLocation: (newLocation) => set(() => ({
    location: newLocation,
    background: locationData[newLocation][locationData[newLocation][0]],
  })),
  getLocations: Object.keys(locationData),

  day: 13,
  nextDay: () => set((state) => ({ day: state.day + 1 })),
  advanceDay: (days) => set((state) => ({ day: state.day + days })),
  convertCharacterName: (name) => {
    if (name === 'sean') return 'Mystery'
    else if (name === 'boy') return 'Havier'
    return name
  },

  mode: "vn",
  setMode: (newMode) => set(() => ({ mode: newMode })),

  stage: 'sean',
  setStage: (newStage) => set(() => ({ stage: newStage })),
  arena: null,
  setArena: (newArena) => set(() => ({ arena: newArena })),

  allies: ['sean'],
  setAllies: (newAllies) => set(() => ({ allies: newAllies })),
  addAlly: (newAlly) => set((state) => ({ allies: state.allies.push(newAlly) })),
  party: ['sean'],
  setParty: (newParty) => set(() => ({ party: newParty })),
  partyStats: defaultPartyStats,
  setPartyStats: (newStats) => set(() => ({ partyStats: newStats })),
  bionas: [alliesData['nk-cell']],
  setBionas: (newBionas) => set(() => ({ bionas: newBionas })),

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
    else if (a === 'go-to-dungeon-battle') {
      state.setMode("battle")
      const a = stages[state.stage][action.value]
      if (!a) console.warn(`Couldn't find arena for ${stage} at ${index}`)
      state.setArena(a)
    }
    return {}
  }),

  dialog: null,
  setDialog: (newDialog) => set(() => ({ dialog: newDialog })),

  toolbarVisible: true,
}))

