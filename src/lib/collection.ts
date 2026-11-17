import type { Spot } from "./types";

// Phase 1 only: the collection lives in the browser. DynamoDB replaces it in phase 3.
const KEY = "carspotr.collection";

export function loadCollection(): Spot[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Spot[]) : [];
  } catch {
    return [];
  }
}

export function saveCollection(spots: Spot[]): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(spots));
    return true;
  } catch {
    return false;
  }
}
