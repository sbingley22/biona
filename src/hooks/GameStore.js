import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import dialogData from '../assets/data/dialog.json'
import sociallinkData from '../assets/data/sociallinks.json'
import locationData from '../assets/data/locations.json'
import alliesData from '../assets/data/allies.json'
import stages from '../assets/data/stages.json'
import { defaultPartyStats } from "../utils/battleUtils.js"

export const useGameStore = create(
  persist(
    (set, get) => ({
      background: 'hospital-room.jpeg',
      setBackground: (newBackground) => set(()=>({background: newBackground})),
      location: 'hospital-room',
      moveLocation: (newLocation) => set(() => ({
        location: newLocation,
        background: locationData[newLocation][locationData[newLocation][0]],
      })),
      getLocations: Object.keys(locationData),

      day: 23,
      setDay: (newDay) => set(() => ({ day: newDay })),
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

      devMode: false,
      setDevMode: (dm) => set(() => ({ devMode: dm })),

      mode: "vn",
      setMode: (newMode) => set(() => ({ mode: newMode })),

      stage: 'sean',
      setStage: (newStage) => set(() => ({ stage: newStage })),
      stageLevels: {
        'sean': 0,
        'sofia': 0,
        'boy': 0,
      },
      incrementStageLevel: () => set((state) => {
        const currentStage = state.stage
        const currentLevel = state.stageLevels[currentStage] || 0
        return {
          stageLevels: { 
            ...state.stageLevels, 
            [currentStage]: currentLevel + 1,
          },
        }
      }),
      arena: null,
      setArena: (newArena) => set(() => ({ arena: newArena })),

      allies: ['sean', 'sofia', 'boy'],
      setAllies: (newAllies) => set(() => ({ allies: newAllies })),
      addAlly: (newAlly) => set((state) => ({ allies: [...state.allies, newAlly] })),
      party: ['sean'],
      setParty: (newParty) => set(() => { 
        const tempBionas = []
        newParty.forEach(member => {
          tempBionas.push(alliesData[defaultPartyStats[member].biona])
        })

        return {
          party: newParty,
          bionas: tempBionas,
        }
      }),
      partyStats: defaultPartyStats,
      setPartyStats: (newStats) => set(() => ({ partyStats: newStats })),
      levelUpParty: (levels=1) => set((state) => {
        const tempPartyStats = {...state.partyStats}

        Object.keys(tempPartyStats).forEach((name) => {
          const member = tempPartyStats[name]
          member.level += levels
          member.maxHealth += 5 * levels
          member.maxEnergy += 5 * levels
        })

        return {
          partyStats: tempPartyStats,
        }
      }),

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
        else if (a === 'set-stage') {
          state.setStage(action.value)
        }
        else if (a === 'dialog') {
          state.setDialog(dialogData[action.value])
        }
        else if (a === 'social-link') {
          state.setDialog(sociallinkData[action.value])
        }
        else if (a === 'go-to-dungeon') {
          state.setMode("battle")
        }
        else if (a === 'go-to-dungeon-battle') {
          state.setMode("battle")
          const a = stages[state.stage][action.value]
          if (!a) console.warn(`Couldn't find arena for ${state.stage} at ${action.value}`)
          state.setArena(a)
        }
        return {}
      }),

      dialog: null,
      setDialog: (newDialog) => set(() => ({ dialog: newDialog })),

      toolbarVisible: true,
    }),
    {
      name: 'game-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        day: state.day,
        location: state.location,
        background: state.background,
        //mode: state.mode,
        allies: state.allies,
        party: state.party,
        partyStats: state.partyStats,
        bionas: state.bionas,
        inventory: state.inventory,
        stage: state.stage,
        stageLevels: state.stageLevels,
        arena: state.arena,
      }),
    }
  )
)
