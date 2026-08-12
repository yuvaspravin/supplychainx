import React from "react";
import { Network, RefreshCw, Database } from "lucide-react";

export const Header = React.memo(
  ({ onRefresh, isRefreshing, nodeCount, linkCount }) => {
    return (
      <header className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              SupplyChainX
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                CognoDB Active
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Multi-Tier Supply Chain Risk & Relationship Navigator
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-xs text-slate-400 flex items-center space-x-3 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-indigo-400" /> {nodeCount}{" "}
              Nodes
            </span>
            <span className="text-slate-600">|</span>
            <span>{linkCount} Links</span>
          </div>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2 text-xs bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium px-3.5 py-2 rounded-lg transition-colors shadow-lg shadow-indigo-600/20"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span>Sync Graph</span>
          </button>
        </div>
      </header>
    );
  },
);
