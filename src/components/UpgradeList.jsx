import { Home, Building2, Factory, Rocket, Clock } from "lucide-react";

const ICONS = { Home, Building2, Factory, Rocket };

export default function UpgradeList({ buildings, getCost, buy, canAfford, format, queue, owned }) {
  const countInQueue = (id) => queue.filter((q) => q.id === id).length;

  return (
    <section className="rounded-xl border border-slate-200 bg-white/70 backdrop-blur p-4">
      <h2 className="text-lg font-semibold mb-4">Construções e Upgrades</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {buildings.map((b) => {
          const Icon = ICONS[b.icon] || Home;
          const cost = getCost(b);
          const afford = canAfford(cost);
          const inQueue = countInQueue(b.id);
          return (
            <div key={b.id} className="rounded-lg border border-slate-200 overflow-hidden bg-gradient-to-br from-white to-slate-50">
              <div className={`h-1 bg-gradient-to-r ${b.color}`} />
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-slate-800/90 text-white">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-medium">{b.name}</div>
                      <div className="text-xs text-slate-500">{b.desc}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Possuídos</div>
                    <div className="font-semibold">{owned[b.id] || 0}</div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-slate-500">Custo</div>
                    <div className="font-medium">$ {format(cost)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Produção</div>
                    <div className="font-medium">$ {b.baseProduction.toFixed(2)}/s</div>
                  </div>
                  <div className="flex items-center gap-1 justify-end">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <div className="text-xs text-slate-600">{b.buildTime}s</div>
                  </div>
                </div>

                {inQueue > 0 && (
                  <div className="mt-2 text-xs text-slate-500">Na fila: {inQueue}</div>
                )}

                <button
                  onClick={() => buy(b.id)}
                  disabled={!afford}
                  className={`mt-3 w-full rounded-lg px-3 py-2 font-medium transition-colors border ${
                    afford
                      ? "bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600"
                      : "bg-slate-200 text-slate-500 border-slate-300 cursor-not-allowed"
                  }`}
                >
                  Comprar {b.name}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
