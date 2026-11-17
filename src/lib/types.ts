export type Rarity = "common" | "uncommon" | "rare" | "legendary";

export interface CarIdentification {
  make: string;
  model: string;
  generation: string;
  years: string;
  rarity: Rarity;
  confidence: number;
}

/** Relative coordinates (0..1) so they work at any image size. */
export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PrivacyRegions {
  plates: Box[];
  faces: Box[];
}

export interface RecognizeResponse {
  car: CarIdentification;
  privacy: PrivacyRegions;
  engine: "mock";
}

export interface Spot {
  id: string;
  car: CarIdentification;
  imageDataUrl: string;
  spottedAt: string;
}
