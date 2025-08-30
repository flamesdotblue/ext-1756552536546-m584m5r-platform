import { useEffect, useMemo, useState } from "react";
import { Construction } from "lucide-react";

export default function BuildQueue({ queue }) {
  const [now, setNow] = useState(performance.now());

  useEffect(() => {
    const id = setInterval(() => setNow(performance.now()), 100);
    return () => clearInterval(id);
  }, []);

  const items = useMemo(() => {
    return queue.map((item) => {
      const total = item.duration * 1000;
      const remaining = Math.max(0, item.endsAt - now);
      const progress = Math.min(1, 1 - remaining / total);
      return { ...item, remainingMs: remaining, progress };
    });
  }, [queue, now]);

  if (items.length === 0) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white/70 backdrop-blur p-4">
        <div className="flex items-center gap-2 text-slate-600">
          <Construction className="w-4 h-4" />
          <span>Sem construções na fila.</span>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white/70 backdrop-blur p-4">
      <h2 className="text-lg font-semibold mb-4">Fila de Construção</h2>
      <div className="space-y-3">
        {items.map((it, idx) => (
          <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-white">
            <div className="flex items-center justify-between mb-2 text-sm">
              <div className="font-medium">{it.name}</div>
              <div className="text-slate-500">
                {Math.ceil(it.remainingMs / 1000)}s restantes
              </div>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500"
                style={{ width: `${(it.progress * 100).toFixed(1)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
