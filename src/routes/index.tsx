import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { SaveManager, type Records, type Settings } from "@/game/save";
import { SettingsPanel } from "@/components/game/SettingsPanel";
import { MenuScenery } from "@/components/game/MenuScenery";
import { Button } from "@/components/ui/button";
import { Armory } from "@/components/game/Armory";

const GameView = lazy(() => import("@/components/game/GameView").then((m) => ({ default: m.GameView })));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dusk Hollow — fantasy exploration platformer" },
      { name: "description", content: "Climb tiered fantasy worlds, discover treasure and battle enemies with double jumps, parries and permanent upgrades." },
      { property: "og:title", content: "Dusk Hollow — fantasy exploration platformer" },
      { property: "og:description", content: "Climb tiered fantasy worlds, discover treasure and battle enemies with double jumps, parries and permanent upgrades." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [playing, setPlaying] = useState(false);
  const [records, setRecords] = useState<Records | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showArmory, setShowArmory] = useState(false);
  useEffect(() => {
    if (playing) return;
    setRecords(SaveManager.loadRecords());
    setSettings(SaveManager.loadSettings());
  }, [playing]);

  if (playing)
    return (
      <ClientOnly fallback={<div className="title-screen" />}><Suspense fallback={<div className="title-screen" />}>
        <GameView onHome={() => setPlaying(false)} />
      </Suspense></ClientOnly>
    );
  return (
    <main className="title-screen w-full">
      <MenuScenery />
      <div className="relative z-10 flex w-full flex-col items-center justify-center px-4 text-center">
        {showArmory ? (
          <Armory onBack={() => setShowArmory(false)} />
        ) : showSettings && settings ? (
          <>
            <h2 className="mb-6 font-display text-4xl text-parchment">Settings</h2>
            <SettingsPanel value={settings} onChange={(s) => { setSettings(s); SaveManager.saveSettings(s); }} />
            <Button variant="game" size="game" className=" mt-8" onClick={() => setShowSettings(false)}>Back</Button>
          </>
        ) : (
          <>
            <h1 className="title-logo font-display">Dusk Hollow</h1>
            <div className="mt-6 flex w-72 flex-col items-stretch gap-3">
              <Button variant="game" size="game" className="" onClick={() => {
                  setPlaying(true);
                  // phones: go fullscreen and lock to landscape (ignored where unsupported)
                  const el = document.documentElement as HTMLElement & { requestFullscreen?: (o?: object) => Promise<void> };
                  if (window.matchMedia("(pointer: coarse)").matches && !document.fullscreenElement && el.requestFullscreen) {
                    el.requestFullscreen({ navigationUI: "hide" })
                      .then(() => (screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> }).lock?.("landscape"))
                      .catch(() => {});
                  }
                }}>Begin Adventure</Button>
              <Button variant="game" size="game" className=" menu-btn-ghost" onClick={() => setShowArmory(true)}>Armory</Button>
              <Button variant="game" size="game" className=" menu-btn-ghost" onClick={() => setShowSettings(true)}>Settings</Button>
            </div>
            {records && records.bestWave > 0 && (
              <p className="mt-6 font-display text-sm text-parchment">Best wave {records.bestWave}</p>
            )}
          </>
        )}
      </div>
    </main>
  );
}
