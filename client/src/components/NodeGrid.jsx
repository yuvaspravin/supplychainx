import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";

export const NodeGrid = React.memo(({ nodes, selectedNode, onSelectNode }) => {
  const [search, setSearch] = useState("");
  const [filterLabel, setFilterLabel] = useState("ALL");

  // Memoized filter for high performance during user typing
  const filteredNodes = useMemo(() => {
    return nodes.filter((node) => {
      const matchesSearch = (node.properties.name || node.properties.id || "")
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesLabel =
        filterLabel === "ALL" || node.labels.includes(filterLabel);
      return matchesSearch && matchesLabel;
    });
  }, [nodes, search, filterLabel]);

  return (
    <div className="space-y-3">
      {/* Search & Filter Controls */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search nodes by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <select
          value={filterLabel}
          onChange={(e) => setFilterLabel(e.target.value)}
          className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
        >
          <option value="ALL">All Labels</option>
          <option value="Company">Company</option>
          <option value="Component">Component</option>
          <option value="Product">Product</option>
        </select>
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[420px] overflow-y-auto pr-1">
        {filteredNodes.length === 0 ? (
          <p className="text-xs text-slate-500 col-span-2 py-8 text-center">
            No matching entities found.
          </p>
        ) : (
          filteredNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <div
                key={node.id}
                onClick={() => onSelectNode(node)}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                  isSelected
                    ? "bg-indigo-600/15 border-indigo-500 shadow-md shadow-indigo-500/10"
                    : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-semibold text-indigo-400 font-mono">
                    {node.labels.join(", ")}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    #{node.properties.id}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-200 mt-1 truncate">
                  {node.properties.name || node.properties.id}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
});
