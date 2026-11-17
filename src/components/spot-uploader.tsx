"use client";

import { useEffect, useState } from "react";
import { loadCollection, saveCollection } from "@/lib/collection";
import { redactImage } from "@/lib/redact";
import type { Rarity, RecognizeResponse, Spot } from "@/lib/types";

const RARITY_LABEL: Record<Rarity, string> = {
  common: "Comune",
  uncommon: "Non comune",
  rare: "Rara",
  legendary: "Leggendaria",
};

const RARITY_STYLE: Record<Rarity, string> = {
  common: "bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200",
  uncommon: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  rare: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
  legendary: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
};

type Status = "idle" | "working" | "error";

export function SpotUploader() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [current, setCurrent] = useState<Spot | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    // localStorage is only available after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSpots(loadCollection());
  }, []);

  async function handleFile(file: File) {
    setStatus("working");
    setError("");
    setCurrent(null);
    try {
      const form = new FormData();
      form.append("photo", file);
      const res = await fetch("/api/recognize", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Riconoscimento non riuscito");

      const { car, privacy } = data as RecognizeResponse;
      const imageDataUrl = await redactImage(file, [...privacy.plates, ...privacy.faces]);
      const spot: Spot = {
        id: crypto.randomUUID(),
        car,
        imageDataUrl,
        spottedAt: new Date().toISOString(),
      };
      setCurrent(spot);
      setStatus("idle");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore imprevisto");
      setStatus("error");
    }
  }

  function addToCollection() {
    if (!current) return;
    const next = [current, ...spots];
    if (!saveCollection(next)) {
      setError("Spazio del browser esaurito: la collezione non è stata salvata");
      return;
    }
    setSpots(next);
    setCurrent(null);
  }

  return (
    <div className="flex flex-col gap-10">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-zinc-300 p-10 text-center transition hover:border-zinc-500 dark:border-zinc-700 dark:hover:border-zinc-500">
        <span className="text-lg font-medium">
          {status === "working" ? "Riconoscimento in corso…" : "Carica la foto di un'auto"}
        </span>
        <span className="text-sm text-zinc-500">JPEG, PNG o WebP, massimo 8 MB</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          disabled={status === "working"}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
            e.target.value = "";
          }}
        />
      </label>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      {current && (
        <section className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element -- local data URL */}
          <img src={current.imageDataUrl} alt={`${current.car.make} ${current.car.model}`} className="w-full" />
          <div className="flex flex-col gap-3 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">
                  {current.car.make} {current.car.model}
                </h2>
                <p className="text-zinc-500">
                  {current.car.generation} · {current.car.years}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-sm font-medium ${RARITY_STYLE[current.car.rarity]}`}>
                {RARITY_LABEL[current.car.rarity]}
              </span>
            </div>
            <p className="text-sm text-zinc-500">
              Affidabilità {Math.round(current.car.confidence * 100)}% · riconoscimento simulato · targa
              oscurata (simulata) · dati EXIF e GPS rimossi
            </p>
            <button
              type="button"
              onClick={addToCollection}
              className="self-start rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              Aggiungi alla collezione
            </button>
          </div>
        </section>
      )}

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">La tua collezione ({spots.length})</h2>
        {spots.length === 0 ? (
          <p className="text-sm text-zinc-500">Ancora nessun avvistamento.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {spots.map((s) => (
              <li key={s.id} className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element -- local data URL */}
                <img src={s.imageDataUrl} alt={`${s.car.make} ${s.car.model}`} className="aspect-[4/3] w-full object-cover" />
                <div className="p-2 text-sm">
                  <p className="font-medium">
                    {s.car.make} {s.car.model}
                  </p>
                  <p className="text-zinc-500">{RARITY_LABEL[s.car.rarity]}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
