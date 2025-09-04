export const createAnimations = (scene) => {
  scene.anims.create({
    key: 'soldierIdle',
    frames: scene.anims.generateFrameNumbers('Soldier', {
      frames: [0, 1, 2, 3, 4, 5]
    }),
    frameRate: 12,
    repeat: -1
  })

  scene.anims.create({
    key: 'soldierWalk',
    frames: scene.anims.generateFrameNumbers('Soldier', {
      frames: [9, 10, 11, 12, 13, 14, 15, 16]
    }),
    frameRate: 12,
    repeat: -1
  })

  scene.anims.create({
    key: 'soldierMeleeAttack',
    frames: scene.anims.generateFrameNumbers('Soldier', {
      frames: [18, 19, 20, 21, 22, 23]
    }),
    frameRate: 12,
    repeat: 0
  })

  scene.anims.create({
    key: 'soldierBowAttack',
    frames: scene.anims.generateFrameNumbers('Soldier', {
      start: 36,
      end: 44
    }),
    frameRate: 12,
    repeat: 0
  })

  scene.anims.create({
    key: 'soldierDamage',
    frames: scene.anims.generateFrameNumbers('Soldier', {
      frames: [45, 46, 47, 48]
    }),
    frameRate: 12,
    repeat: 0
  })

  scene.anims.create({
    key: 'soldierDeath',
    frames: scene.anims.generateFrameNumbers('Soldier', {
      frames: [54, 55, 56, 57]
    }),
    frameRate: 12,
    repeat: 0
  })

  scene.anims.create({
    key: 'orcIdle',
    frames: scene.anims.generateFrameNumbers('Orc', { frames: [0, 1, 2, 3, 4, 5] }),
    frameRate: 12,
    repeat: -1
  })

  scene.anims.create({
    key: 'orcWalk',
    frames: scene.anims.generateFrameNumbers('Orc', { frames: [9, 10, 11, 12, 13, 14, 15, 16] }),
    frameRate: 12,
    repeat: -1
  })

  scene.anims.create({
    key: 'orcMeleeAttack',
    frames: scene.anims.generateFrameNumbers('Orc', { frames: [17, 18, 19, 20, 21] }),
    frameRate: 12,
    repeat: 0
  })

  scene.anims.create({
    key: 'orcDamage',
    frames: scene.anims.generateFrameNumbers('Orc', {
      frames: [32, 33, 34, 35]
    }),
    frameRate: 12,
    repeat: 0
  })

  scene.anims.create({
    key: 'orcDeath',
    frames: scene.anims.generateFrameNumbers('Orc', {
      frames: [40, 41, 42, 43]
    }),
    frameRate: 12,
    repeat: 0
  })
}

export const createOverworldAnimations = (scene) => {
  scene.anims.create({
    key: 'overworldIdle1',
    frames: scene.anims.generateFrameNumbers('overworldEntities', {
      frames: [0, 1]
    }),
    frameRate: 4,
    repeat: -1
  })

  scene.anims.create({
    key: 'overworldIdle2',
    frames: scene.anims.generateFrameNumbers('overworldEntities', {
      frames: [8, 9]
    }),
    frameRate: 4,
    repeat: -1
  })

  scene.anims.create({
    key: 'overworldOrcIdle',
    frames: scene.anims.generateFrameNumbers('overworldEntities', {
      frames: [60, 61]
    }),
    frameRate: 4,
    repeat: -1
  })

  scene.anims.create({
    key: 'merchantIdle',
    frames: scene.anims.generateFrameNumbers('merchant', {
      frames: [0, 1]
    }),
    frameRate: 4,
    repeat: -1
  })

  scene.anims.create({
    key: 'settler',
    frames: scene.anims.generateFrameNumbers('settler', {
      frames: [0, 1]
    }),
    frameRate: 4,
    repeat: -1
  })
}

export const createMinifolksAnimations = (scene) => {
  scene.anims.create({
    key: 'shieldmanIdle',
    frames: scene.anims.generateFrameNumbers('ShieldMan', {
      frames: [0, 1, 2, 3]
    }),
    frameRate: 8,
    repeat: -1
  })
  scene.anims.create({
    key: 'shieldmanWalk',
    frames: scene.anims.generateFrameNumbers('ShieldMan', {
      frames: [6, 7, 8, 9, 10, 11]
    }),
    frameRate: 12,
    repeat: -1
  })
  scene.anims.create({
    key: 'shieldmanDamage',
    frames: scene.anims.generateFrameNumbers('ShieldMan', {
      frames: [30, 31, 32, 30]
    }),
    frameRate: 12,
    repeat: 0
  })
  scene.anims.create({
    key: 'shieldmanDeath',
    frames: scene.anims.generateFrameNumbers('ShieldMan', {
      frames: [36, 37, 38, 39, 39, 39]
    }),
    frameRate: 12,
    repeat: 0
  })
  scene.anims.create({
    key: 'shieldmanMeleeAttack',
    frames: scene.anims.generateFrameNumbers('ShieldMan', {
      frames: [18, 19, 20, 21, 22, 23]
    }),
    frameRate: 12,
    repeat: 0
  })
  scene.anims.create({
    key: 'shieldmanBlock',
    frames: scene.anims.generateFrameNumbers('ShieldMan', {
      frames: [24, 25, 26, 27, 28, 29]
    }),
    frameRate: 12,
    repeat: 0
  })
}
