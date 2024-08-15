import Phaser from "phaser"
import { ActionMarker } from "./classes/Markers"

export const Random = Phaser.Math.Between

export const RandomFromArray = Phaser.Utils.Array.GetRandom

export const killChessAt = (chess) => {
  var chessToKill = chess.board.tileXYZToChess(
    chess.tileXYZ.x,
    chess.tileXYZ.y,
    1
  )
  chessToKill.hideMoveableArea && chessToKill.hideMoveableArea()
  chessToKill.hidePossibleActions && chessToKill.hidePossibleActions()
  
  chess.board.removeChess(chessToKill, null, null, null, true)
}

export const getUnitAt = (chess) => {
  return chess.board.tileXYZToChess(
    chess.tileXYZ.x,
    chess.tileXYZ.y,
    1
  )
}

export const getAvailableTile = (board, tileXY, range) => {
  range = range || 2
  if (board.getRandomEmptyTileXYInRange(tileXY, range, 1)) {
    return board.getRandomEmptyTileXYInRange(tileXY, range, 1)
  } else {
    return getAvailableTile(board, tileXY, range + 1)
  }
}

export const cameFrom = (origin, destination) => {
  let x = origin.rexChess.tileXYZ.x - destination.rexChess.tileXYZ.x
  let y = origin.rexChess.tileXYZ.y - destination.rexChess.tileXYZ.y

  // 1 2
  // 0 3

  if (x === 0) {
    return y > 0 ? 1 : 2
  } else {
    return x > 0 ? 3 : 0
  }
}

export const damageUnit = (chess, damage) => {
  var chessToDamage = chess.board.tileXYZToChess(chess.tileXYZ.x, chess.tileXYZ.y, 1)
  chessToDamage.hideMoveableArea && chessToDamage.hideMoveableArea()
  chessToDamage.hidePossibleActions && chessToDamage.hidePossibleActions()
  
  chessToDamage.takeDamage(damage)
}

export const addActionMarkersTo = (chess, coordList) => {
  coordList.forEach((coord) => {
    chess._actionMarkers.push(new ActionMarker(chess, coord))
  })
  return true
}

export const delay = (ms) => new Promise((res) => setTimeout(res, ms))
