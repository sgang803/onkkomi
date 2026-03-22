export type Layer = {
  id: string;
  assetId: string;
  imageUrl: string;
  x: number; // logical stage coordinate
  y: number; // logical stage coordinate
  z: number; // higher = on top
};

export type Draft = {
  characterId: string;
  layers: Layer[];
};

