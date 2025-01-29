import { Scene } from 'phaser'
import GesturesPlugin from 'phaser3-rex-plugins/plugins/pinch-plugin'
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin'
import { buildDrag } from '../gameFunctions/Camera'

const COLOR_PRIMARY = 0x4e342e
const COLOR_LIGHT = 0x7b5e57
const COLOR_DARK = 0x260e04

export class TechTree extends Scene {
  constructor() {
    super('TechTree')
  }

  preload() {
    // this.load.scenePlugin({
    //   key: 'rexboardplugin',
    //   url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexboardplugin.min.js',
    //   sceneKey: 'rexBoard'
    // })

    this.load.plugin({
      key: 'rexpinchplugin',
      url: GesturesPlugin
    })

    this.load.scenePlugin({
      key: 'rexUI',
      url: UIPlugin,
      mapping: 'rexUI'
    })
  }

  create() {
    buildDrag(this)
    var CheckboxesMode = true // false = radio mode

    var background = this.rexUI.add.roundRectangle(0, 0, 0, 0, 20, COLOR_PRIMARY)

    var btns = {}
    var keys = 'ABCDEF',
      key
    for (var i = 0, cnt = keys.length; i < cnt; i++) {
      key = keys[i]
      btns[key] = createButton(this, key)
    }

    var buttons = this.rexUI.add
      .gridButtons({
        x: 200,
        y: 200,
        width: 300,
        height: 200,

        background: background,

        buttons: [
          [btns['A'], btns['B'], btns['C']],
          [btns['D'], btns['E'], btns['F']]
        ],
        space: {
          left: 10,
          right: 10,
          top: 20,
          bottom: 20,
          row: 20,
          column: 10
        },

        type: CheckboxesMode ? 'checkboxes' : 'radio',
        setValueCallback: function (button, value) {
          button.getElement('icon').setFillStyle(value ? COLOR_LIGHT : undefined)
        }
      })
      .layout()

    console.log(buttons)

    // Dump states
    var print = this.add.text(0, 0, '')
    var dumpButtonStates = function () {
      if (CheckboxesMode) {
        // checkboxes
        var s = ''
        buttons.data?.foreach(function (buttons, key, value) {
          s += `${key}:${value}\n`
        })
        print.setText(s)
      } else {
        // radio
        print.setText(buttons.value)
      }
    }
    buttons.on('button.click', dumpButtonStates)
    dumpButtonStates()
  }
}

var createButton = function (scene, text) {
  return scene.rexUI.add.label({
    background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10).setStrokeStyle(2, COLOR_LIGHT),
    icon: scene.add.circle(0, 0, 10).setStrokeStyle(1, COLOR_DARK),
    text: scene.add.text(0, 0, text, {
      fontSize: 18
    }),
    space: {
      icon: 10
    },
    align: 'center',
    name: text
  })
}
