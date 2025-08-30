import { Home, Building2, Factory, Rocket } from "lucide-react";

const ICONS = { Home, Building2, Factory, Rocket };

export default function ResourcePanel({ money, productionPerSecond, owned, buildings, format }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white/70 backdrop-blur p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-slate-500 text-xs uppercase tracking-widest">Tesouro</div>
          <div className="text-3xl font-semibold">$ {format(money)}</div>
          <div className="text-sm text-slate-500">Produção passiva: $ {productionPerSecond.toFixed(2)} / s</div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {buildings.map((b) => {
            const Icon = ICONS[b.icon] || Home;
            return (
              <div key={b.id} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 bg-gradient-to-br from-white to-slate-50">
                <span className="p-2 rounded-md bg-gradient-to-br text-slate-800 shadow-sm " style={{ background: undefined }}>
                  <Icon className="w-4 h-4" />
                </span>
                <div>
                  <div className="text-xs text-slate-500">{b.name}</div>
                  <div className="text-sm font-medium">{owned[b.id] || 0}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
