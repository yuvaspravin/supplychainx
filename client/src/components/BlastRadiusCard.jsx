import React from "react";

export const BlastRadiusCard = React.memo(({ blastResult }) => {
  if (!blastResult) return null;

  return (
    <div className="p-5 bg-red-950/20 border border-red-900/40 rounded-xl space-y-3 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold text-red-300 uppercase tracking-wider">
          Downstream Blast Radius
        </h3>
        <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded font-mono font-bold">
          {blastResult.totalImpacted} Impacted
        </span>
      </div>

      <p className="text-xs text-slate-400">
        Disruption at company{" "}
        <span className="text-white font-mono">
          {blastResult.sourceCompanyId}
        </span>{" "}
        propagates multi-hop down the supply chain affecting:
      </p>

      <div className="space-y-2 pt-1 max-h-48 overflow-y-auto">
        {blastResult.impactedProducts.map((item, idx) => (
          <div
            key={idx}
            className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg flex justify-between items-center text-xs"
          >
            <div>
              <p className="font-semibold text-slate-200">
                {item.product.name}
              </p>
              <p className="text-[10px] text-slate-500">
                SKU: {item.product.sku}
              </p>
            </div>
            <span className="text-[10px] font-mono text-red-400 bg-red-500/10 px-2 py-1 rounded border border-red-500/20">
              {item.depth} Hops Away
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});
