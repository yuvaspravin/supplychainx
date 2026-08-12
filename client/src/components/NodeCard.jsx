import React from "react";
import { AlertTriangle, Building2, Cpu, Box, ShieldAlert } from "lucide-react";

const labelIcons = {
  Company: Building2,
  Component: Cpu,
  Product: Box,
};

// Helper function to extract primitive values safely
const formatValue = (val) => {
  if (val === null || val === undefined) return "N/A";
  if (typeof val === "object") {
    // If it's a Neo4j Integer object with a toNumber method
    if (typeof val.toNumber === "function") return val.toNumber();
    // If it's a Neo4j Integer object with low/high properties
    if ("low" in val) return val.low;
    // Fallback JSON stringification
    return JSON.stringify(val);
  }
  return val.toString();
};

export const NodeCard = React.memo(
  ({ selectedNode, onCalculateBlastRadius, loadingBlast }) => {
    if (!selectedNode) {
      return (
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl text-center space-y-2">
          <ShieldAlert className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-sm font-medium text-slate-300">
            No Entity Selected
          </p>
          <p className="text-xs text-slate-500">
            Select any node from the catalog to inspect properties and execute
            Cypher multi-hop traversals.
          </p>
        </div>
      );
    }

    const { labels, properties } = selectedNode;
    const mainLabel = labels[0] || "Node";
    const IconComponent = labelIcons[mainLabel] || Box;
    const isCompany = labels.includes("Company");

    return (
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4 shadow-xl">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                {mainLabel}
              </span>
              <h2 className="text-base font-bold text-white mt-1">
                {formatValue(properties.name || properties.id)}
              </h2>
            </div>
          </div>
        </div>

        {/* Property Breakdown */}
        <div className="grid grid-cols-2 gap-2.5 py-3 border-t border-b border-slate-800 text-xs">
          {Object.entries(properties).map(([key, val]) => (
            <div
              key={key}
              className="bg-slate-950 p-2 rounded border border-slate-800/80"
            >
              <p className="text-[10px] text-slate-500 uppercase tracking-wide">
                {key}
              </p>
              <p className="font-semibold text-slate-200 mt-0.5 truncate">
                {formatValue(val)}{" "}
                {/* 👈 FIXED: Calling formatValue(val) here! */}
              </p>
            </div>
          ))}
        </div>

        {/* Action CTA for Graph Multi-hop Traversal */}
        {isCompany && (
          <button
            onClick={() => onCalculateBlastRadius(properties.id)}
            disabled={loadingBlast}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-medium text-xs rounded-lg transition-colors shadow-lg shadow-red-600/20"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>
              {loadingBlast
                ? "Executing Cypher Traversal..."
                : "Run 2+ Hop Blast Radius Analysis"}
            </span>
          </button>
        )}
      </div>
    );
  },
);
