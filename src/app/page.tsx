import { SpotUploader } from "@/components/spot-uploader";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-12 sm:px-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">carspotr</h1>
        <p className="text-zinc-500">
          Fotografa un&apos;auto, scopri marca, modello e generazione, costruisci la tua collezione.
        </p>
      </header>
      <SpotUploader />
    </main>
  );
}
