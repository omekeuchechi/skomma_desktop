import Phaser from 'phaser';
import { PlotConfig, Position, Shape, BuildingRoof, SoundConfig, DecorativeObject } from '../types/index';

/**
 * Creates a plot with specified configuration
 * @param scene - Phaser scene instance
 * @param config - Plot configuration object
 * @returns Container with all plot elements
 */
export function createPlot(
  scene: Phaser.Scene,
  config: PlotConfig
): Phaser.GameObjects.Container {
  const { position, width, height, groundShape, groundRadius, groundColor, shapes, shapesPositions, buildingRoofs, objCollision, objSounds, decorativeObjects } = config;

  // Create plot container
  const plotContainer = scene.add.container(position.x, position.y);

  // Create plot ground
  if (groundShape && groundShape !== 'rectangle') {
    const color = groundColor ? parseInt(groundColor.replace('#', '0x'), 16) : 0x707070;
    const radius = groundRadius || Math.min(width, height) / 2;

    switch (groundShape) {
      case 'circle':
        const circle = scene.add.circle(0, 0, radius, color);
        circle.setOrigin(0.5, 0.5);
        plotContainer.add(circle);
        break;

      case 'ellipse':
        const ellipse = scene.add.ellipse(0, 0, width / 2, height / 2, color);
        ellipse.setOrigin(0.5, 0.5);
        plotContainer.add(ellipse);
        break;

      case 'triangle':
        const triangleGraphics = scene.add.graphics();
        triangleGraphics.fillStyle(color, 1);
        triangleGraphics.beginPath();
        triangleGraphics.moveTo(0, -radius);
        triangleGraphics.lineTo(-radius, radius);
        triangleGraphics.lineTo(radius, radius);
        triangleGraphics.closePath();
        triangleGraphics.fillPath();
        plotContainer.add(triangleGraphics);
        break;

      case 'star':
        const starGraphics = scene.add.graphics();
        const innerRadius = radius / 2;
        starGraphics.fillStyle(color, 1);
        starGraphics.beginPath();
        for (let i = 0; i < 10; i++) {
          const r = i % 2 === 0 ? radius : innerRadius;
          const angle = (i * Math.PI) / 5 - Math.PI / 2;
          const x = r * Math.cos(angle);
          const y = r * Math.sin(angle);
          if (i === 0) {
            starGraphics.moveTo(x, y);
          } else {
            starGraphics.lineTo(x, y);
          }
        }
        starGraphics.closePath();
        starGraphics.fillPath();
        plotContainer.add(starGraphics);
        break;

      case 'diamond':
        const diamondGraphics = scene.add.graphics();
        diamondGraphics.fillStyle(color, 1);
        diamondGraphics.beginPath();
        diamondGraphics.moveTo(0, -radius);
        diamondGraphics.lineTo(radius, 0);
        diamondGraphics.lineTo(0, radius);
        diamondGraphics.lineTo(-radius, 0);
        diamondGraphics.closePath();
        diamondGraphics.fillPath();
        plotContainer.add(diamondGraphics);
        break;

      case 'hexagon':
        const hexGraphics = scene.add.graphics();
        hexGraphics.fillStyle(color, 1);
        hexGraphics.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3 - Math.PI / 2;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          if (i === 0) {
            hexGraphics.moveTo(x, y);
          } else {
            hexGraphics.lineTo(x, y);
          }
        }
        hexGraphics.closePath();
        hexGraphics.fillPath();
        plotContainer.add(hexGraphics);
        break;
    }
  } else {
    // Default rectangular ground (gray #707070)
    const color = groundColor ? parseInt(groundColor.replace('#', '0x'), 16) : 0x707070;
    const plotGround = scene.add.rectangle(0, 0, width, height, color);
    plotGround.setOrigin(0.5, 0.5);
    plotContainer.add(plotGround);
  }

  // Add shapes to plot
  shapes.forEach((shape, index) => {
    const shapePos = shapesPositions[index] || { x: 0, y: 0 };
    const shapeObj = createShape(scene, shape, shapePos);
    if (shapeObj) {
      plotContainer.add(shapeObj);
    }
  });

  // Add building roofs
  buildingRoofs.forEach((building, index) => {
    const buildingObj = createBuilding(scene, building, objCollision[index] || false);
    if (buildingObj) {
      plotContainer.add(buildingObj);
    }
  });

  // Add decorative objects
  if (decorativeObjects) {
    decorativeObjects.forEach((obj) => {
      const decorativeObj = createDecorativeObject(scene, obj);
      if (decorativeObj) {
        plotContainer.add(decorativeObj);
      }
    });
  }

  // Store sound configurations for later use
  plotContainer.setData('sounds', objSounds);

  return plotContainer;
}

/**
 * Creates a shape object based on configuration
 */
function createShape(
  scene: Phaser.Scene,
  shape: Shape,
  position: Position
): Phaser.GameObjects.GameObject | null {
  const { type, width, height, radius, color, texture, points, innerRadius } = shape;
  const colorValue = parseInt(color.replace('#', '0x'), 16);

  switch (type) {
    case 'rectangle':
      if (texture) {
        const rect = scene.add.image(position.x, position.y, texture);
        rect.setOrigin(0.5, 0.5);
        if (width && height) {
          rect.displayWidth = width;
          rect.displayHeight = height;
        }
        return rect;
      } else {
        const rect = scene.add.rectangle(position.x, position.y, width || 100, height || 100, colorValue);
        rect.setOrigin(0.5, 0.5);
        return rect;
      }

    case 'circle':
      if (texture) {
        const circle = scene.add.image(position.x, position.y, texture);
        circle.setOrigin(0.5, 0.5);
        if (radius) {
          circle.displayWidth = radius * 2;
          circle.displayHeight = radius * 2;
        }
        return circle;
      } else {
        const circle = scene.add.circle(position.x, position.y, radius || 50, colorValue);
        circle.setOrigin(0.5, 0.5);
        return circle;
      }

    case 'ellipse':
      if (texture) {
        const ellipse = scene.add.image(position.x, position.y, texture);
        ellipse.setOrigin(0.5, 0.5);
        if (width && height) {
          ellipse.displayWidth = width;
          ellipse.displayHeight = height;
        }
        return ellipse;
      } else {
        const ellipse = scene.add.ellipse(position.x, position.y, (width || 100) / 2, (height || 60) / 2, colorValue);
        ellipse.setOrigin(0.5, 0.5);
        return ellipse;
      }

    case 'triangle':
      const graphics = scene.add.graphics();
      const triangleSize = width || 100;
      graphics.fillStyle(colorValue, 1);
      graphics.beginPath();
      graphics.moveTo(position.x, position.y - triangleSize / 2);
      graphics.lineTo(position.x - triangleSize / 2, position.y + triangleSize / 2);
      graphics.lineTo(position.x + triangleSize / 2, position.y + triangleSize / 2);
      graphics.closePath();
      graphics.fillPath();
      return graphics;

    case 'star':
      const starGraphics = scene.add.graphics();
      const outerRadius = radius || 50;
      const starInnerRadius = innerRadius || outerRadius / 2;
      const starPoints = points || 5;
      starGraphics.fillStyle(colorValue, 1);
      starGraphics.beginPath();
      for (let i = 0; i < starPoints * 2; i++) {
        const r = i % 2 === 0 ? outerRadius : starInnerRadius;
        const angle = (i * Math.PI) / starPoints - Math.PI / 2;
        const x = position.x + r * Math.cos(angle);
        const y = position.y + r * Math.sin(angle);
        if (i === 0) {
          starGraphics.moveTo(x, y);
        } else {
          starGraphics.lineTo(x, y);
        }
      }
      starGraphics.closePath();
      starGraphics.fillPath();
      return starGraphics;

    case 'diamond':
      const diamondGraphics = scene.add.graphics();
      const diamondSize = width || 100;
      diamondGraphics.fillStyle(colorValue, 1);
      diamondGraphics.beginPath();
      diamondGraphics.moveTo(position.x, position.y - diamondSize / 2);
      diamondGraphics.lineTo(position.x + diamondSize / 2, position.y);
      diamondGraphics.lineTo(position.x, position.y + diamondSize / 2);
      diamondGraphics.lineTo(position.x - diamondSize / 2, position.y);
      diamondGraphics.closePath();
      diamondGraphics.fillPath();
      return diamondGraphics;

    case 'hexagon':
      const hexGraphics = scene.add.graphics();
      const hexRadius = radius || 50;
      hexGraphics.fillStyle(colorValue, 1);
      hexGraphics.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3 - Math.PI / 2;
        const x = position.x + hexRadius * Math.cos(angle);
        const y = position.y + hexRadius * Math.sin(angle);
        if (i === 0) {
          hexGraphics.moveTo(x, y);
        } else {
          hexGraphics.lineTo(x, y);
        }
      }
      hexGraphics.closePath();
      hexGraphics.fillPath();
      return hexGraphics;

    case 'custom':
      // For custom shapes, you can add more complex logic here
      return null;

    default:
      return null;
  }
}

/**
 * Creates a building with roof and door
 */
function createBuilding(
  scene: Phaser.Scene,
  building: BuildingRoof,
  hasCollision: boolean
): Phaser.GameObjects.Container | null {
  const { image, position, width, height, hasDoor, doorPosition, doorImage, sceneName } = building;

  const buildingContainer = scene.add.container(position.x, position.y);

  // Load and add building roof image
  const roof = scene.add.image(0, 0, image);
  roof.setOrigin(0.5, 0.5);
  roof.displayWidth = width;
  roof.displayHeight = height;
  buildingContainer.add(roof);

  // Add door if specified
  if (hasDoor && doorPosition) {
    if (doorImage) {
      const door = scene.add.image(doorPosition.x, doorPosition.y, doorImage);
      door.setOrigin(0.5, 0.5);
      buildingContainer.add(door);
    }

    // Store door position for collision detection (even without door image)
    buildingContainer.setData('doorPosition', doorPosition);
    buildingContainer.setData('doorImage', doorImage || '');
    buildingContainer.setData('sceneName', sceneName || '');
  }

  // Add collision if specified
  if (hasCollision) {
    buildingContainer.setData('hasCollision', true);
  }

  return buildingContainer;
}

/**
 * Creates a decorative object based on configuration
 */
function createDecorativeObject(
  scene: Phaser.Scene,
  obj: DecorativeObject
): Phaser.GameObjects.GameObject | null {
  const { type, position, width, height, radius, size, color, texture, rotation, hasCollision, text, font, fontSize } = obj;
  const colorValue = color ? parseInt(color.replace('#', '0x'), 16) : 0xffffff;
  const scale = size || 1;

  switch (type) {
    case 'sign':
      if (texture) {
        const sign = scene.add.image(position.x, position.y, texture);
        sign.setOrigin(0.5, 0.5);
        if (width && height) {
          sign.displayWidth = width;
          sign.displayHeight = height;
        }
        if (rotation) sign.setRotation(rotation);
        if (hasCollision) sign.setData('hasCollision', true);
        return sign;
      } else {
        const signWidth = width || 100;
        const signHeight = height || 60;
        const legHeight = 20;
        const legWidth = 8;
        const signContainer = scene.add.container(position.x, position.y);

        const signGraphics = scene.add.graphics();
        // Sign board
        signGraphics.fillStyle(colorValue, 1);
        signGraphics.fillRect(-signWidth / 2, -signHeight / 2, signWidth, signHeight);
        signGraphics.lineStyle(2, 0x000000, 1);
        signGraphics.strokeRect(-signWidth / 2, -signHeight / 2, signWidth, signHeight);

        // Left leg
        signGraphics.fillStyle(0x333333, 1);
        signGraphics.fillRect(-signWidth / 2 + 10, signHeight / 2, legWidth, legHeight);

        // Right leg
        signGraphics.fillRect(signWidth / 2 - 10 - legWidth, signHeight / 2, legWidth, legHeight);

        signContainer.add(signGraphics);

        if (text) {
          const textObj = scene.add.text(0, 0, text, {
            fontSize: `${fontSize || 16}px`,
            fontFamily: font || 'Arial',
            color: '#000000',
            align: 'center'
          });
          textObj.setOrigin(0.5, 0.5);
          signContainer.add(textObj);
        }

        // Add invisible collision rectangle
        if (hasCollision) {
          const collisionRect = scene.add.rectangle(0, 0, signWidth, signHeight + legHeight, 0x000000, 0);
          collisionRect.setOrigin(0.5, 0.5);
          collisionRect.setData('hasCollision', true);
          collisionRect.setData('objectType', 'sign');
          signContainer.add(collisionRect);
        }

        if (rotation) signContainer.setRotation(rotation);
        return signContainer;
      }

    case 'chair':
      if (texture) {
        const chair = scene.add.image(position.x, position.y, texture);
        chair.setOrigin(0.5, 0.5);
        if (width && height) {
          chair.displayWidth = width;
          chair.displayHeight = height;
        }
        if (rotation) chair.setRotation(rotation);
        if (hasCollision) chair.setData('hasCollision', true);
        return chair;
      } else {
        const chairGraphics = scene.add.graphics();
        const chairWidth = width || 40;
        const chairHeight = height || 40;
        chairGraphics.fillStyle(colorValue, 1);
        // Simple chair shape
        chairGraphics.fillRect(position.x - chairWidth / 2, position.y - chairHeight / 2, chairWidth, chairHeight);
        chairGraphics.fillRect(position.x - chairWidth / 2, position.y + chairHeight / 2, chairWidth / 3, 10); // Back
        if (rotation) chairGraphics.setRotation(rotation);
        if (hasCollision) chairGraphics.setData('hasCollision', true);
        return chairGraphics;
      }

    case 'fountain':
      if (texture) {
        const fountain = scene.add.image(position.x, position.y, texture);
        fountain.setOrigin(0.5, 0.5);
        if (width && height) {
          fountain.displayWidth = width;
          fountain.displayHeight = height;
        }
        if (scale !== 1) fountain.setScale(scale);
        if (rotation) fountain.setRotation(rotation);
        if (hasCollision) fountain.setData('hasCollision', true);
        return fountain;
      } else {
        const fountainRadius = (radius || 50) * scale;
        const basinWidth = 10 * scale;
        const fountainContainer = scene.add.container(position.x, position.y);
        fountainContainer.setScale(scale);

        // Static base graphics
        const baseGraphics = scene.add.graphics();
        baseGraphics.fillStyle(0x9e9e9e, 1);
        baseGraphics.fillCircle(0, 0, fountainRadius);
        baseGraphics.fillStyle(0x757575, 1);
        baseGraphics.fillCircle(0, 0, fountainRadius - basinWidth);
        baseGraphics.fillStyle(0x4fc3f7, 1);
        baseGraphics.fillCircle(0, 0, fountainRadius - basinWidth - 3);
        baseGraphics.fillStyle(0x0288d1, 1);
        baseGraphics.fillCircle(0, 0, fountainRadius * 0.4);
        baseGraphics.fillStyle(0x616161, 1);
        baseGraphics.fillCircle(0, 0, 8);
        fountainContainer.add(baseGraphics);

        // Create expanding ripple effect
        function createRipple() {
          const ripple = scene.add.graphics();
          ripple.lineStyle(2, 0x81d4fa, 0.8);
          ripple.strokeCircle(0, 0, 8);
          fountainContainer.add(ripple);

          scene.tweens.add({
            targets: ripple,
            props: {
              scale: { from: 1, to: 4 },
              alpha: { from: 0.8, to: 0 }
            },
            duration: 2000,
            ease: 'Quad.easeOut',
            onComplete: () => {
              ripple.destroy();
            }
          });
        }

        // Spawn ripples continuously
        scene.time.addEvent({
          delay: 400,
          callback: createRipple,
          loop: true
        });

        // Create water spray particles
        function createSprayParticle() {
          const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
          const distance = Phaser.Math.FloatBetween(5, 15);
          const startX = Math.cos(angle) * distance;
          const startY = Math.sin(angle) * distance - 15;

          const particle = scene.add.circle(startX, startY, Phaser.Math.FloatBetween(2, 4), 0x81d4fa);
          particle.setAlpha(Phaser.Math.FloatBetween(0.5, 0.8));
          fountainContainer.add(particle);

          const targetX = startX + Phaser.Math.FloatBetween(-10, 10);
          const targetY = startY + Phaser.Math.FloatBetween(10, 20);

          scene.tweens.add({
            targets: particle,
            x: targetX,
            y: targetY,
            alpha: 0,
            scale: { from: 1, to: 0.5 },
            duration: Phaser.Math.FloatBetween(600, 1000),
            ease: 'Quad.easeIn',
            onComplete: () => {
              particle.destroy();
            }
          });
        }

        // Spawn spray particles frequently
        scene.time.addEvent({
          delay: 100,
          callback: createSprayParticle,
          loop: true
        });

        // Create falling droplets from spout
        function createFallingDroplet() {
          const startX = Phaser.Math.FloatBetween(-4, 4);
          const droplet = scene.add.circle(startX, -15, Phaser.Math.FloatBetween(2, 3), 0x4fc3f7);
          droplet.setAlpha(0.7);
          fountainContainer.add(droplet);

          scene.tweens.add({
            targets: droplet,
            y: 10,
            alpha: 0,
            duration: Phaser.Math.FloatBetween(400, 700),
            ease: 'Bounce.easeOut',
            onComplete: () => {
              droplet.destroy();
            }
          });
        }

        // Spawn falling droplets
        scene.time.addEvent({
          delay: 150,
          callback: createFallingDroplet,
          loop: true
        });

        // Central water spray (continuous upward spray)
        const sprayCenter = scene.add.circle(0, -12, 6, 0x81d4fa);
        sprayCenter.setAlpha(0.6);
        fountainContainer.add(sprayCenter);

        scene.tweens.add({
          targets: sprayCenter,
          y: -20,
          scale: { from: 1, to: 0.3 },
          alpha: { from: 0.6, to: 0.2 },
          duration: 300,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });

        // Sparkle effect (random positions)
        function createSparkle() {
          const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
          const distance = Phaser.Math.FloatBetween(10, 25);
          const sparkle = scene.add.circle(
            Math.cos(angle) * distance,
            Math.sin(angle) * distance - 10,
            Phaser.Math.FloatBetween(1, 2),
            0xffffff
          );
          sparkle.setAlpha(0);
          fountainContainer.add(sparkle);

          scene.tweens.add({
            targets: sparkle,
            alpha: { from: 0, to: 0.8 },
            duration: Phaser.Math.FloatBetween(250, 400),
            yoyo: true,
            repeat: 1,
            ease: 'Sine.easeInOut',
            onComplete: () => {
              sparkle.destroy();
            }
          });
        }

        // Spawn sparkles randomly
        scene.time.addEvent({
          delay: 300,
          callback: createSparkle,
          loop: true
        });

        if (rotation) fountainContainer.setRotation(rotation);

        // Add invisible collision rectangle
        if (hasCollision) {
          const collisionRect = scene.add.rectangle(0, 0, fountainRadius * 2, fountainRadius * 2, 0x000000, 0);
          collisionRect.setOrigin(0.5, 0.5);
          collisionRect.setData('hasCollision', true);
          collisionRect.setData('objectType', 'fountain');
          fountainContainer.add(collisionRect);
        }

        fountainContainer.setData('objectType', 'fountain');
        return fountainContainer;
      }

    case 'tree':
      if (texture) {
        const tree = scene.add.image(position.x, position.y, texture);
        tree.setOrigin(0.5, 0.5);
        if (width && height) {
          tree.displayWidth = width;
          tree.displayHeight = height;
        }
        if (rotation) tree.setRotation(rotation);
        if (hasCollision) tree.setData('hasCollision', true);
        return tree;
      } else {
        const treeRadius = radius || 30;
        const trunkWidth = 12;
        const trunkHeight = 30;
        const treeContainer = scene.add.container(position.x, position.y);

        const treeGraphics = scene.add.graphics();

        // Trunk (wider at bottom)
        treeGraphics.fillStyle(0x5d4037, 1);
        treeGraphics.beginPath();
        treeGraphics.moveTo(-trunkWidth / 2, trunkHeight);
        treeGraphics.lineTo(trunkWidth / 2, trunkHeight);
        treeGraphics.lineTo(trunkWidth / 3, 0);
        treeGraphics.lineTo(-trunkWidth / 3, 0);
        treeGraphics.closePath();
        treeGraphics.fillPath();

        // Trunk texture lines
        treeGraphics.lineStyle(1, 0x3e2723, 0.5);
        treeGraphics.beginPath();
        treeGraphics.moveTo(-2, 5);
        treeGraphics.lineTo(-2, trunkHeight - 5);
        treeGraphics.moveTo(2, 5);
        treeGraphics.lineTo(2, trunkHeight - 5);
        treeGraphics.strokePath();

        // Foliage - multiple layers for depth
        // Bottom layer (largest, darker green)
        treeGraphics.fillStyle(0x2e7d32, 1);
        treeGraphics.fillCircle(0, -5, treeRadius * 0.9);

        // Middle layer (medium green)
        treeGraphics.fillStyle(0x388e3c, 1);
        treeGraphics.fillCircle(0, -12, treeRadius * 0.8);

        // Top layer (lighter green, smaller)
        treeGraphics.fillStyle(0x43a047, 1);
        treeGraphics.fillCircle(0, -20, treeRadius * 0.6);

        // Highlight on top
        treeGraphics.fillStyle(0x66bb6a, 0.3);
        treeGraphics.fillCircle(-treeRadius * 0.2, -25, treeRadius * 0.2);

        treeContainer.add(treeGraphics);

        // Add invisible collision rectangle
        if (hasCollision) {
          const collisionRect = scene.add.rectangle(0, 0, treeRadius * 1.5, treeRadius * 1.5, 0x000000, 0);
          collisionRect.setOrigin(0.5, 0.5);
          collisionRect.setData('hasCollision', true);
          collisionRect.setData('objectType', 'tree');
          treeContainer.add(collisionRect);
        }

        if (rotation) treeContainer.setRotation(rotation);
        return treeContainer;
      }

    case 'bench':
      if (texture) {
        const bench = scene.add.image(position.x, position.y, texture);
        bench.setOrigin(0.5, 0.5);
        if (width && height) {
          bench.displayWidth = width;
          bench.displayHeight = height;
        }
        if (rotation) bench.setRotation(rotation);
        if (hasCollision) bench.setData('hasCollision', true);
        return bench;
      } else {
        const benchWidth = width || 80;
        const benchHeight = height || 20;
        const benchContainer = scene.add.container(position.x, position.y);

        const benchGraphics = scene.add.graphics();
        benchGraphics.fillStyle(colorValue, 1);
        benchGraphics.fillRect(-benchWidth / 2, -benchHeight / 2, benchWidth, benchHeight);
        // Legs
        benchGraphics.fillRect(-benchWidth / 2, benchHeight / 2, 5, 10);
        benchGraphics.fillRect(benchWidth / 2 - 5, benchHeight / 2, 5, 10);

        benchContainer.add(benchGraphics);

        // Add invisible collision rectangle
        if (hasCollision) {
          const collisionRect = scene.add.rectangle(0, 0, benchWidth, benchHeight + 10, 0x000000, 0);
          collisionRect.setOrigin(0.5, 0.5);
          collisionRect.setData('hasCollision', true);
          collisionRect.setData('objectType', 'bench');
          benchContainer.add(collisionRect);
        }

        if (rotation) benchContainer.setRotation(rotation);
        return benchContainer;
      }

    case 'lamp':
      if (texture) {
        const lamp = scene.add.image(position.x, position.y, texture);
        lamp.setOrigin(0.5, 0.5);
        if (width && height) {
          lamp.displayWidth = width;
          lamp.displayHeight = height;
        }
        if (rotation) lamp.setRotation(rotation);
        if (hasCollision) lamp.setData('hasCollision', true);
        return lamp;
      } else {
        const lampGraphics = scene.add.graphics();
        const lampHeight = height || 60;
        const lampWidth = width || 10;
        // Pole
        lampGraphics.fillStyle(0x333333, 1);
        lampGraphics.fillRect(position.x - lampWidth / 2, position.y, lampWidth, lampHeight);
        // Light
        lampGraphics.fillStyle(0xffeb3b, 1);
        lampGraphics.fillCircle(position.x, position.y, 10);
        if (rotation) lampGraphics.setRotation(rotation);
        if (hasCollision) lampGraphics.setData('hasCollision', true);
        return lampGraphics;
      }

    case 'waterfall':
      if (texture) {
        const waterfall = scene.add.image(position.x, position.y, texture);
        waterfall.setOrigin(0.5, 0.5);
        if (width && height) {
          waterfall.displayWidth = width;
          waterfall.displayHeight = height;
        }
        if (rotation) waterfall.setRotation(rotation);
        if (hasCollision) waterfall.setData('hasCollision', true);
        return waterfall;
      } else {
        const waterfallGraphics = scene.add.graphics();
        const waterfallWidth = width || 40;
        const waterfallHeight = height || 100;
        // Water flow
        waterfallGraphics.fillStyle(0x4fc3f7, 1);
        waterfallGraphics.fillRect(position.x - waterfallWidth / 2, position.y - waterfallHeight / 2, waterfallWidth, waterfallHeight);
        // Rock base
        waterfallGraphics.fillStyle(0x757575, 1);
        waterfallGraphics.fillRect(position.x - waterfallWidth, position.y + waterfallHeight / 2, waterfallWidth * 2, 20);
        if (rotation) waterfallGraphics.setRotation(rotation);
        if (hasCollision) waterfallGraphics.setData('hasCollision', true);
        return waterfallGraphics;
      }

    case 'statue':
      if (texture) {
        const statue = scene.add.image(position.x, position.y, texture);
        statue.setOrigin(0.5, 0.5);
        if (width && height) {
          statue.displayWidth = width;
          statue.displayHeight = height;
        }
        if (rotation) statue.setRotation(rotation);
        if (hasCollision) statue.setData('hasCollision', true);
        return statue;
      } else {
        const statueGraphics = scene.add.graphics();
        const statueHeight = height || 80;
        const statueWidth = width || 30;
        // Base
        statueGraphics.fillStyle(0x757575, 1);
        statueGraphics.fillRect(position.x - statueWidth / 2, position.y + statueHeight / 2 - 10, statueWidth, 10);
        // Body
        statueGraphics.fillStyle(colorValue, 1);
        statueGraphics.fillRect(position.x - statueWidth / 4, position.y - statueHeight / 2, statueWidth / 2, statueHeight);
        if (rotation) statueGraphics.setRotation(rotation);
        if (hasCollision) statueGraphics.setData('hasCollision', true);
        return statueGraphics;
      }

    case 'custom':
      // For custom objects, you can add more complex logic here
      return null;

    default:
      return null;
  }
}

/**
 * Export type for barrel file
 */
export type { PlotConfig, Position, Shape, BuildingRoof, SoundConfig, DecorativeObject };
