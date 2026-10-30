import React from 'react';

interface MiniMapProps {
  playerPosition: { x: number; y: number };
  plotPositions: Array<{ x: number; y: number; width: number; height: number }>;
  worldBounds: { minX: number; maxX: number; minY: number; maxY: number };
}

export default function MiniMap({ playerPosition, plotPositions, worldBounds }: MiniMapProps) {
  const mapSize = 200;
  const scale = mapSize / (worldBounds.maxX - worldBounds.minX);

  const mapX = (playerPosition.x - worldBounds.minX) * scale;
  const mapY = (playerPosition.y - worldBounds.minY) * scale;

  return (
    <div
      className="absolute top-4 right-4 bg-black bg-opacity-80 border-2 border-white rounded-lg"
      style={{ width: mapSize, height: mapSize }}
    >
      {/* World bounds background */}
      <div className="absolute inset-0 bg-green-900 opacity-50" />

      {/* Plot markers */}
      {plotPositions.map((plot, index) => {
        const plotMapX = (plot.x - worldBounds.minX) * scale;
        const plotMapY = (plot.y - worldBounds.minY) * scale;
        const plotMapWidth = plot.width * scale;
        const plotMapHeight = plot.height * scale;

        return (
          <div
            key={index}
            className="absolute bg-gray-500 border border-gray-400"
            style={{
              left: plotMapX,
              top: plotMapY,
              width: plotMapWidth,
              height: plotMapHeight,
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}

      {/* Player marker */}
      <div
        className="absolute bg-blue-500 rounded-full border-2 border-white z-10"
        style={{
          left: mapX,
          top: mapY,
          width: 8,
          height: 8,
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Label */}
      <div className="absolute bottom-1 left-1 text-white text-xs bg-black bg-opacity-50 px-1 rounded">
        Mini-Map
      </div>
    </div>
  );
}
