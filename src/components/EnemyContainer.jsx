import React from 'react'
import { convertTypeNames } from '../utils/battleUtils'

export default function EnemyContainer({ enemies, selectedEnemy, setSelectedEnemy, weaknesses, turn }) {
  return (
    <div id='enemy-container'>
      {enemies.map((en, i) =>
        en.stats.health > 0 && (
          <img
            key={`enemy${i}`}
            src={en['img-url'] + 'idle.png'}
            className={selectedEnemy === i && turn ? 'selected' : ''}
            onClick={() => setSelectedEnemy(i)}
          />
        )
      )}
      {turn && selectedEnemy !== -1 && weaknesses[selectedEnemy] && (
        <div id='weaknesses'>
          {Object.entries(weaknesses[selectedEnemy]).map(([name, value], i) => (
            <div key={`${name}-${i}`}>
              <p>{convertTypeNames(name)}</p>
              <p>{value ?? 'null'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
