import React from 'react'
import { convertTypeNames } from '../utils/battleUtils'

export default function EnemyContainer({ enemies, selectedEnemy, setSelectedEnemy, weaknesses, turn, enemyRefs }) {

  const effects = []
  const statusEffects = enemies[selectedEnemy]?.statusEffects
  if (statusEffects) {
    statusEffects.forEach(e => {
      if (e.turns > 0) effects.push(e.type)
    });
  }

  return (
    <div id='enemy-container'>
      {enemies.map((en, i) =>
        en.stats.health > 0 && (
          <div className='enemy-portrait' key={`enemy${i}`} >
            <img
              ref={el => (enemyRefs.current[i] = el)}
              src={en['img-url'] + 'idle.png'}
              className={selectedEnemy === i && turn ? 'selected' : ''}
              onClick={() => setSelectedEnemy(i)}
              title={en.stats.health}
            />
            <p
              className='enemy-stats'
              style={{right: i*0 + "%"}}
            >
              {en.stats.health}
            </p>
          </div>
        )
      )}

      {turn && selectedEnemy !== -1 && weaknesses[selectedEnemy] && (
        <div id='weaknesses'>
          {Object.entries(weaknesses[selectedEnemy]).map(([name, value], i) => (
            <div 
              key={`${name}-${i}`}
              className={effects.includes(name) ? "active" : ''}
            >
              <p>{convertTypeNames(name)}</p>
              <p>{value ?? 'null'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
