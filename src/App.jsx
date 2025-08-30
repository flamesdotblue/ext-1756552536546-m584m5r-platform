import { useEffect, useMemo, useState } from "react";
import ResourcePanel from "./components/ResourcePanel";
import ClickerButton from "./components/ClickerButton";
import UpgradeList from "./components/UpgradeList";
import BuildQueue from "./components/BuildQueue";

const BUILDINGS = [
  {
    id: "casa",
    name: "Casa",
    icon: "Home",
    baseCost: 10,
    costMultiplier: 1.15,
    baseProduction: 0.2, // por segundo
    buildTime: 1.5, // segundos
    desc: "Residência simples que gera pequenos impostos.",
    color: "from-emerald-200 to-emerald-300",
  },
  {
    id: "predio",
    name: "Prédio",
    icon: "Building2",
    baseCost: 120,
    costMultiplier: 1.17,
    baseProduction: 2,
    buildTime: 4,
    desc: "Acomoda mais pessoas e aumenta a arrecadação.",
    color: "from-cyan-200 to-cyan-300",
  },
  {
    id: "fabrica",
    name: "Fábrica",
    icon: "Factory",
    baseCost: 900,
    costMultiplier: 1.2,
    baseProduction: 8,
    buildTime: 8,
    desc: "Transforma matéria-prima em lucro consistente.",
    color: "from-indigo-200 to-indigo-300",
  },
  {
    id: "pesquisa",
    name: "Centro de Pesquisa",
    icon: "Rocket",
    baseCost: 4000,
    costMultiplier: 1.22,
    baseProduction: 30,
    buildTime: 12,
    desc: "Inovações que impulsionam a produtividade.",
    color: "from-fuchsia-200 to-fuchsia-300",
  },
];

const initialOwned = Object.fromEntries(BUILDINGS.map(b => [b.id, 0]));

function loadState() {
  try {
    const raw = localStorage.getItem("cidade-produtiva-state");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Basic sanity checks
    if (typeof parsed.money !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveState(state) {
  try {
    localStorage.setItem("cidade-produtiva-state", JSON.stringify(state));
  } catch {}
}

export default function App() {
  const persisted = loadState();
  const [money, setMoney] = useState(persisted?.money ?? 0);
  const [owned, setOwned] = useState(persisted?.owned ?? initialOwned);
  const [queue, setQueue] = useState(persisted?.queue ?? []); // {id, name, endsAt, duration}
  const [lastTick, setLastTick] = useState(performance.now());
  const [clickPower, setClickPower] = useState(persisted?.clickPower ?? 1);

  const productionPerSecond = useMemo(() => {
    return BUILDINGS.reduce((acc, b) => acc + (owned[b.id] || 0) * b.baseProduction, 0);
  }, [owned]);

  // Game loop: passive income + build queue processing
  useEffect(() => {
    let rafId;
    const loop = (now) => {
      const dt = Math.min(0.25, (now - lastTick) / 1000); // clamp 250ms
      setLastTick(now);
      if (productionPerSecond > 0) {
        setMoney((m) => m + productionPerSecond * dt);
      }
      if (queue.length > 0) {
        const current = queue[0];
        if (now >= current.endsAt) {
          // complete
          setQueue((q) => q.slice(1));
          setOwned((o) => ({ ...o, [current.id]: (o[current.id] || 0) + 1 }));
        }
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [lastTick, productionPerSecond, queue]);

  // Persist state
  useEffect(() => {
    saveState({ money, owned, queue, clickPower });
  }, [money, owned, queue, clickPower]);

  const format = (n) => {
    if (n < 1000) return n.toFixed(2);
    const units = ["", "K", "M", "B", "T", "Qa", "Qi"]; 
    let u = 0; let x = n;
    while (x >= 1000 && u < units.length - 1) { x /= 1000; u++; }
    return x.toFixed(2) + units[u];
  };

  const getCost = (b) => {
    const count = owned[b.id] + queue.filter(q => q.id === b.id).length;
    return b.baseCost * Math.pow(b.costMultiplier, count);
  };

  const canAfford = (cost) => money >= cost;

  const buy = (buildingId) => {
    const b = BUILDINGS.find(x => x.id === buildingId);
    if (!b) return;
    const cost = getCost(b);
    if (!canAfford(cost)) return;
    const now = performance.now();
    setMoney((m) => m - cost);
    setQueue((q) => [
      ...q,
      {
        id: b.id,
        name: b.name,
        duration: b.buildTime,
        endsAt: now + b.buildTime * 1000,
      },
    ]);
  };

  const onClickCollect = () => {
    setMoney((m) => m + clickPower);
  };

  const reset = () => {
    setMoney(0);
    setOwned(initialOwned);
    setQueue([]);
    setClickPower(1);
    localStorage.removeItem("cidade-produtiva-state");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Cidade Produtiva</h1>
            <p className="text-slate-600">Comece com uma vila e construa uma metrópole eficiente.</p>
          </div>
          <button onClick={reset} className="text-xs px-3 py-1.5 rounded-md bg-slate-200 hover:bg-slate-300 transition-colors">Reiniciar</button>
        </header>

        <ResourcePanel
          money={money}
          productionPerSecond={productionPerSecond}
          owned={owned}
          buildings={BUILDINGS}
          format={format}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <UpgradeList
              buildings={BUILDINGS}
              getCost={getCost}
              buy={buy}
              canAfford={canAfford}
              format={format}
              queue={queue}
              owned={owned}
            />

            <BuildQueue queue={queue} />
          </div>

          <div className="lg:col-span-1">
            <ClickerButton onClick={onClickCollect} clickPower={clickPower} setClickPower={setClickPower} />
          </div>
        </div>

        <footer className="mt-10 text-center text-sm text-slate-500">
          Feito com HTML, CSS e JavaScript (React + Tailwind). Progrida comprando estruturas e coletando manualmente.
        </footer>
      </div>
    </div>
  );
}
