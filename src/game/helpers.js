import Phaser from 'phaser'
import { ActionMarker } from './classes/Markers'

export const Random = Phaser.Math.Between

export const RandomFromArray = Phaser.Utils.Array.GetRandom

export const killChessAt = (chess) => {
  var chessToKill = chess.board.tileXYZToChess(chess.tileXYZ.x, chess.tileXYZ.y, 1)
  chessToKill.hideMoveableArea && chessToKill.hideMoveableArea()
  chessToKill.hidePossibleActions && chessToKill.hidePossibleActions()

  chess.board.removeChess(chessToKill, null, null, null, true)
}

export const getUnitAt = (chess) => {
  return chess.board.tileXYZToChess(chess.tileXYZ.x, chess.tileXYZ.y, 1)
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

export const createCard = (
  scene,
  x,
  y,
  key,
  frame,
  price,
  turns,
  back,
  icon,
  modifier,
  amount,
  text,
  callback
) => {
  let card = new Phaser.GameObjects.Container(scene, x, y, [])

  card.setData('raw', { key, frame, price, turns, back, icon, modifier, amount, text })
  card.setData('price', price)
  let width = 100
  let height = 128

  let front = scene.add.image(0, 0, 'cardsBack', frame)
  front.name = 'front'
  let sold = scene.add.image(0, 0, 'star')
  sold.name = 'sold'
  let over = scene.add.image(0, 0, 'cardOver', 0)
  over.name = 'over'
  let iconGraphic = scene.add.image(1, -29, 'cardIcons', icon)
  iconGraphic.name = 'iconGraphic'

  let textObject = scene.add.text(-40, 20, text, {
    fontFamily: 'PublicPixel',
    fontSize: '8px',
    align: 'left'
  })

  let priceText = scene.add.text(-38, height / 2 - 12, `${price}`, {
    fontFamily: 'PublicPixel',
    fontSize: '6px',
    align: 'left'
  })

  let turnsText = scene.add.text(17, height / 2 - 12, `(${turns})`, {
    fontFamily: 'PublicPixel',
    fontSize: '6px',
    align: 'left'
  })

  sold.setAlpha(0)

  card.add([front, over, textObject, iconGraphic, priceText, turnsText, sold])
  card.setScale(1)
  card.postFX.addShine(1, 0.2, 5)

  card.setSize(width, height)
  card.setInteractive().on('pointerdown', callback)
  card.setScale(2)

  return scene.add.existing(card)
}
