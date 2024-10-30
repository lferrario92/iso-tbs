export const playerTurnStart = (units) => {
  console.log('player turn')
  for (let index = 0; index < units.length; index++) {
    const chess = units[index]
    chess.resetMoveFlag()
    chess.resetActedFlag()
  }
}

export const playerOverworldTurnStart = (units) => {
  units.forEach((unit) => {
    unit.resetMoveFlag()
    unit.resetActedFlag()
  })
}
