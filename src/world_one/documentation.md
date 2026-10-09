# Skomma World Implementation Documentation

## Overview
This document explains the architecture and implementation of the Skomma world system, specifically for Plot_1.

## Folder Structure

```
world_one/
├── terrain/
│   └── plot_1/
│       ├── assets/
│       │   ├── imgs/          # Building roofs, furniture, textures
│       │   │   ├── duplex_roof.jpg
│       │   │   ├── duplex_roof2.jpg
│       │   │   ├── small_building_roof_1.jpeg
│       │   │   ├── small_building_roof_2.jpeg
│       │   │   ├── table.png
│       │   │   └── tiles.jpeg
│       │   └── sounds/       # Sound effects (currently empty)
│       └── scripts/
│           ├── plots_scripts/    # Plot assembly logic
│           │   ├── plot.ts      # Main plot creation function
│           │   └── index.ts     # Barrel export
│           ├── buildings_scenes/ # Indoor building scenes
│           │   ├── buildingScene.ts
│           │   └── index.ts
│           ├── types/            # TypeScript type definitions
│           │   └── index.ts
│           └── services/         # Helper services
│               ├── assetLoader.ts
│               └── index.ts
└── documentation.md
```

## Logic Behind Every Action

### 1. Plot Creation (`plots_scripts/plot.ts`)

**Purpose**: Assemble a plot with buildings, shapes, and sounds.

**Function**: `createPlot(scene, config)`

**Parameters**:
```typescript
{
  position: { x, y },           // Plot location in world
  width: number,                // Plot width
  height: number,               // Plot height
  shapes: [],                   // Grass, decorations, etc.
  shapesPositions: [],          // Position for each shape
  buildingRoofs: [],            // Building images and data
  objCollision: [],             // Which objects have collision
  objSounds: []                 // Sound configurations
}
```

**Process**:
1. Create a gray ground rectangle (#707070) representing the plot land
2. Add shapes (grass, decorations) at specified positions
3. Add building roofs with doors at specified positions
4. Store collision data for each object
5. Store sound configurations for later playback

**Output**: Phaser Container with all plot elements

### 2. Building Creation (`createBuilding` function)

**Purpose**: Create a building with roof and door.

**Process**:
1. Load building roof image from assets
2. Position and scale the roof
3. Add door if specified
4. Store door position for collision detection
5. Store scene name to load when entering

**Door Entry Logic**:
- When passport collides with door position (within threshold)
- Load the specified indoor scene
- Switch from outdoor view to indoor view

### 3. Indoor Building Scenes (`buildings_scenes/buildingScene.ts`)

**Purpose**: Create indoor scenes when entering buildings.

**Function**: `createBuildingScene(scene, config)`

**Parameters**:
```typescript
{
  sceneName: string,             // Scene identifier
  width: number,                 // Scene width
  height: number,                // Scene height
  floorTexture?: string,         // Optional floor image
  objects: [],                   // Indoor furniture/objects
  background?: string            // Optional background color
}
```

**Process**:
1. Create background or floor texture
2. Add indoor objects (tables, chairs, etc.)
3. Store collision data for objects
4. Position passport at entrance

### 4. Shape Creation (`createShape` function)

**Purpose**: Create decorative shapes (grass, custom objects).

**Supported Types**:
- `rectangle`: With or without texture
- `circle`: With or without texture
- `custom`: Extensible for future shapes

### 5. Sound System

**Triggers**:
- `collision`: Play when passport collides with object
- `proximity`: Play when passport is near object
- `click`: Play when user clicks object

**Sound Config**:
```typescript
{
  file: string,          // Sound file name
  trigger: string,       // Trigger type
  target: string,       // Target object name
  volume?: number,      // Optional volume (0-1)
  loop?: boolean        // Loop the sound
}
```

### 6. Asset Loading Service (`services/assetLoader.ts`)

**Purpose**: Centralized asset path management.

**Functions**:
- `loadPlotAssets(scene)`: Load all plot images into Phaser
- `getImagePath(name)`: Get full path for image
- `getSoundPath(name)`: Get full path for sound

**Available Assets**:
- `duplex_roof.jpg` - Large building roof
- `duplex_roof2.jpg` - Alternative large building roof
- `small_building_roof_1.jpeg` - Small building roof
- `small_building_roof_2.jpeg` - Alternative small building roof
- `table.png` - Indoor furniture
- `tiles.jpeg` - Floor texture

## Implementation Plan

### Step 1: Load Assets
```typescript
import { loadPlotAssets } from './services';

// In scene preload
loadPlotAssets(this);
```

### Step 2: Create Plot
```typescript
import { createPlot } from './plots_scripts';

const plotConfig = {
  position: { x: 1000, y: 1000 },
  width: 500,
  height: 500,
  shapes: [
    { type: 'rectangle', width: 100, height: 100, color: '#00ff00' }
  ],
  shapesPositions: [{ x: 50, y: 50 }],
  buildingRoofs: [
    {
      image: 'duplex_roof',
      position: { x: 250, y: 250 },
      width: 200,
      height: 150,
      hasDoor: true,
      doorPosition: { x: 0, y: 75 },
      doorImage: 'door.png',
      sceneName: 'duplex_indoor'
    }
  ],
  objCollision: [true],
  objSounds: []
};

const plot = createPlot(this, plotConfig);
```

### Step 3: Handle Door Entry
```typescript
import { checkDoorEntry } from './buildings_scenes';

// In update loop
if (checkDoorEntry(passportPosition, doorPosition)) {
  loadIndoorScene('duplex_indoor');
}
```

### Step 4: Create Indoor Scene
```typescript
import { createBuildingScene } from './buildings_scenes';

const indoorConfig = {
  sceneName: 'duplex_indoor',
  width: 800,
  height: 600,
  floorTexture: 'tiles',
  objects: [
    {
      image: 'table',
      position: { x: 400, y: 300 },
      width: 100,
      height: 60,
      collision: true
    }
  ],
  background: '#ffffff'
};

const indoorScene = createBuildingScene(this, indoorConfig);
```

## Collision Detection

### Outdoor Collision
- Building roofs block passport movement
- Plot boundaries are walls
- Objects with `objCollision: true` are solid

### Indoor Collision
- Furniture blocks movement
- Walls are scene boundaries
- Door allows exit back to outdoor

## Scene Management

### Outdoor Scene
- Multiple plots visible
- Passport moves freely between plots
- Buildings are visible with roofs

### Indoor Scene
- Single building interior
- Furniture and objects visible
- Door allows exit to outdoor

## Future Enhancements

1. **Add doors images** to assets folder
2. **Add sound files** to sounds folder
3. **Implement sound playback** on triggers
4. **Add more shapes** (trees, fences, etc.)
5. **Add NPC characters** in indoor scenes
6. **Add lighting effects** for indoor scenes
7. **Add inventory system** for picking up objects
