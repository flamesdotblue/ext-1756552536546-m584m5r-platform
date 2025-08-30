import { useState } from "react";
import { MousePointerClick, Plus } from "lucide-react";

export default function ClickerButton({ onClick, clickPower, setClickPower }) {
  const [pop, setPop] = useState(0);

  const handleClick = () => {
    setPop((p) => p + 1);
    onClick();
    setTimeout(() => setPop((p) => Math.max(0, p - 1)), 150);
  };

  const upgradeCost = Math.floor(25 * Math.pow(1.75, clickPower - 1));
  const canUpgrade = false; // handled in parent if needed; keep as label only

  return (
    <div className="sticky top-6">
      <div className="rounded-xl border border-slate-200 bg-white/70 backdrop-blur p-4">
        <div className="mb-3">
          <div className="text-slate-500 text-xs uppercase tracking-widest">Coleta manual</div>
          <div className="text-lg font-medium">+${clickPower.toFixed(0)} por clique</div>
        </div>
        <button
          onClick={handleClick}
          className={`w-full select-none rounded-xl bg-gradient-to-b from-amber-300 to-amber-400 hover:from-amber-200 hover:to-amber-300 active:from-amber-400 active:to-amber-500 text-slate-900 font-semibold py-6 shadow-inner transition-transform ${pop ? "scale-[0.99]" : "scale-100"}`}
        >
          <div className="flex items-center justify-center gap-2">
            <MousePointerClick className="w-5 h-5" />
            Coletar Agora
          </div>
        </button>

        <div className="mt-4 border-t pt-3 text-sm text-slate-600">
          Dica: use a coleta manual para acelerar compras iniciais.
        </div>

        <div className="mt-4">
          <button
            onClick={() => setClickPower((c) => c + 1)}
            className="w-full inline-flex items-center justify-center gap-2 text-sm px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50"
          >
            <Plus className="w-4 h-4" /> Aumentar poder de clique (custo cresce com o tempo)
          </button>
        </div>
      </div>
    </div>
  );
}
