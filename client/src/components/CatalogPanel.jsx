import React from "react";
import { Layers, ShieldAlert } from "lucide-react";
import { NodeGrid } from "./NodeGrid";

export const CatalogPanel = React.memo(
  ({ loading, error, nodes, selectedNode, onSelectNode, onRetry }) => {
    return (
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" /> Entity Catalog
            </h2>
            <span className="text-xs text-slate-500">
              Click to explore relationships
            </span>
          </div>

          {loading ? (
            <div className="py-20 text-center space-y-2">
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400">
                Retrieving openCypher nodes from CognoDB...
              </p>
            </div>
          ) : error ? (
            <div className="py-12 text-center space-y-3 bg-red-950/20 border border-red-900/30 rounded-lg p-4">
              <ShieldAlert className="w-8 h-8 text-red-400 mx-auto" />
              <p className="text-xs font-medium text-red-300">{error}</p>
              <button
                onClick={onRetry}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded transition-colors"
              >
                Retry Connection
              </button>
            </div>
          ) : (
            <NodeGrid
              nodes={nodes}
              selectedNode={selectedNode}
              onSelectNode={onSelectNode}
            />
          )}
        </div>
      </div>
    );
  },
);
