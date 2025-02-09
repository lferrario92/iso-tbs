import GesturesPlugin from 'phaser3-rex-plugins/plugins/gestures-plugin.js'

export const camera = (game) => {
  var cursors = game.input.keyboard.createCursorKeys()
  game.cameraController = new Phaser.Cameras.Controls.SmoothedKeyControl({
    camera: game.cameras.main,

    left: cursors.left,
    right: cursors.right,
    up: cursors.up,
    down: cursors.down,
    zoomIn: game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
    zoomOut: game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),

    acceleration: 0.06,
    drag: 0.003,
    maxSpeed: 0.3
  })

  game.input.mousePointer.motionFactor = 0.5
  game.input.pointer1.motionFactor = 0.5

  //   var cam = game.cameras.main

  //   game.input.on('pointermove', function (p) {
  //     if (!p.isDown) return

  //     const { x, y } = p.velocity

  //     cam.scrollX -= x / cam.zoom
  //     cam.scrollY -= y / cam.zoom
  //   })
}

export const buildDrag = (scene) => {
  var dragScale = scene.plugins.get('rexpinchplugin').add(scene)

  var camera = scene.cameras.main
  dragScale
    .on('drag1', function (dragScale) {
      var drag1Vector = dragScale.drag1Vector
      if (
        camera.scrollX - drag1Vector.x / camera.zoom > 80 ||
        camera.scrollX - drag1Vector.x / camera.zoom < -110
      ) {
        return
      }

      if (
        camera.scrollY - drag1Vector.y / camera.zoom > 63 ||
        camera.scrollY - drag1Vector.y / camera.zoom < -30
      ) {
        return
      }

      camera.scrollX -= drag1Vector.x / camera.zoom
      camera.scrollY -= drag1Vector.y / camera.zoom
    })
    .on(
      'pinch',
      function (dragScale) {
        var scaleFactor = dragScale.scaleFactor

        if (camera.zoom * scaleFactor > 10 || camera.zoom * scaleFactor < 2) {
          return
        }

        camera.zoom *= scaleFactor
      },
      scene
    )
}
