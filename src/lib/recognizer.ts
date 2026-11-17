import type { CarIdentification, PrivacyRegions } from "./types";

// Phase 1 contract: the mock and, later, the Bedrock/Rekognition implementations share it.
export interface CarRecognizer {
  identify(image: Uint8Array): Promise<CarIdentification>;
}

export interface PrivacyDetector {
  detect(image: Uint8Array): Promise<PrivacyRegions>;
}

const CATALOG: Omit<CarIdentification, "confidence">[] = [
  { make: "Fiat", model: "Panda", generation: "III (319)", years: "2012–", rarity: "common" },
  { make: "Volkswagen", model: "Golf", generation: "VIII", years: "2019–", rarity: "common" },
  { make: "Alfa Romeo", model: "Giulia", generation: "952", years: "2016–", rarity: "uncommon" },
  { make: "BMW", model: "M3", generation: "E46", years: "2000–2006", rarity: "rare" },
  { make: "Porsche", model: "911", generation: "992", years: "2019–", rarity: "rare" },
  { make: "Lancia", model: "Delta HF Integrale", generation: "Evoluzione", years: "1991–1994", rarity: "legendary" },
  { make: "Ferrari", model: "F40", generation: "—", years: "1987–1992", rarity: "legendary" },
];

async function digest(image: Uint8Array): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", image as BufferSource));
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Same photo always gives the same answer, so the mock behaves like a stable model.
export const mockRecognizer: CarRecognizer = {
  async identify(image) {
    const hash = await digest(image);
    await delay(600);
    const entry = CATALOG[hash[0] % CATALOG.length];
    return { ...entry, confidence: 0.7 + (hash[1] % 30) / 100 };
  },
};

// Simulated: a plate-sized box in the lower centre, where it sits in most car photos.
export const mockPrivacyDetector: PrivacyDetector = {
  async detect() {
    return {
      plates: [{ x: 0.36, y: 0.7, width: 0.28, height: 0.1 }],
      faces: [],
    };
  },
};
