import { create } from 'zustand'
import dialogData from '../assets/data/dialog.json'
import locationData from '../assets/data/locations.json'
import alliesData from '../assets/data/allies.json'
import stages from '../assets/data/stages.json'

const defaultPartyStats = {
  'sean': {
    biona: "nk-cell",
    level: 1,
    health: 150,
    maxHealth: 150,
    energy: 30,
    maxEnergy: 30,
    nerfs: [],
    buffs: [],
    statusEffects: [],
  },
  'sofia': {
    biona: "b-cell",
    level: 1,
    health: 145,
    maxHealth: 145,
    energy: 60,
    maxEnergy: 60,
    nerfs: [],
    buffs: [],
    statusEffects: [],
  },
  'boy': {
    biona: "t-cell",
    level: 1,
    health: 100,
    maxHealth: 100,
    energy: 60,
    maxEnergy: 60,
    nerfs: [],
    buffs: [],
    statusEffects: [],
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

  day: 12,
  nextDay: () => set((state) => ({ day: state.day + 1 })),
  advanceDay: (days) => set((state) => ({ day: state.day + days })),
  convertCharacterName: (name) => {
    if (name === 'sean') return 'Mystery'
    else if (name === 'sofia') return 'Sofia'
    else if (name === 'boy') return 'Havier'
    else if (name === 'nk-cell') return 'Natural Killer Cell'
    else if (name === 'b-cell') return 'B Cell'
    else if (name === 't-cell') return 'T Cell'
    return name
  },

  mode: "vn",
  setMode: (newMode) => set(() => ({ mode: newMode })),

  stage: 'sean',
  setStage: (newStage) => set(() => ({ stage: newStage })),
  arena: null,
  setArena: (newArena) => set(() => ({ arena: newArena })),

  allies: ['sean', 'sofia', 'boy'],
  setAllies: (newAllies) => set(() => ({ allies: newAllies })),
  addAlly: (newAlly) => set((state) => ({ allies: state.allies.push(newAlly) })),
  party: ['sean', 'sofia'],
  setParty: (newParty) => set(() => ({ party: newParty })),
  partyStats: defaultPartyStats,
  setPartyStats: (newStats) => set(() => ({ partyStats: newStats })),
  bionas: [alliesData['nk-cell'], alliesData['b-cell']],
  setBionas: (newBionas) => set(() => ({ bionas: newBionas })),

  inventory: {
    'chocobar':2, 
    'vita-drink':1,
    "vita-drink-pack":1,
    "antidote": 1,
  },
  setInventory: (newInventory) => set({ inventory: newInventory }),
  addItem: (newItem) => {
    set((state) => {
      const currentInventory = state.inventory;
      const updatedInventory = {
        ...currentInventory,
        [newItem]: (currentInventory[newItem] || 0) + 1,
      };
      return { inventory: updatedInventory };
    });
  },
  removeItem: (itemToRemove) => {
    set((state) => {
      const currentInventory = state.inventory;
      const updatedInventory = { ...currentInventory }; // Create a shallow copy

      if (updatedInventory[itemToRemove] && updatedInventory[itemToRemove] > 0) {
        updatedInventory[itemToRemove] -= 1;
        // Optionally, remove the item from the object if its quantity reaches 0
        if (updatedInventory[itemToRemove] === 0) {
          delete updatedInventory[itemToRemove];
        }
      }
      return { inventory: updatedInventory };
    });
  },

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

