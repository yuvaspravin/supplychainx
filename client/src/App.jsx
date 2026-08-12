import React, { useState, useEffect, useCallback } from "react";
import { fetchGraphData, fetchBlastRadius } from "./services/api";
import { Header } from "./components/Header";
import { NodeCard } from "./components/NodeCard";
import { CatalogPanel } from "./components/CatalogPanel";
import { BlastRadiusCard } from "./components/BlastRadiusCard";

export default function App() {
  const [graph, setGraph] = useState({ nodes: [], links: [] });
  const [selectedNode, setSelectedNode] = useState(null);
  const [blastResult, setBlastResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingBlast, setLoadingBlast] = useState(false);
  const [error, setError] = useState(null);

  // Fetch full graph state
  const loadGraph = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGraphData();
      setGraph(data);
    } catch (err) {
      setError(err.message || "Unable to connect to backend service");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGraph();
  }, [loadGraph]);

  // Execute Cypher multi-hop query
  const handleBlastRadius = useCallback(async (companyId) => {
    setLoadingBlast(true);
    try {
      const result = await fetchBlastRadius(companyId);
      setBlastResult(result);
    } catch (err) {
      alert(`Blast Radius calculation failed: ${err.message}`);
    } finally {
      setLoadingBlast(false);
    }
  }, []);

  const handleSelectNode = useCallback((node) => {
    setSelectedNode(node);
    setBlastResult(null);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header
        onRefresh={loadGraph}
        isRefreshing={loading}
        nodeCount={graph.nodes.length}
        linkCount={graph.links.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Catalog Panel */}
        <CatalogPanel
          loading={loading}
          error={error}
          nodes={graph.nodes}
          selectedNode={selectedNode}
          onSelectNode={handleSelectNode}
          onRetry={loadGraph}
        />

        {/* Right Column: Inspector & Blast Radius Overlay */}
        <div className="space-y-4">
          <NodeCard
            selectedNode={selectedNode}
            onCalculateBlastRadius={handleBlastRadius}
            loadingBlast={loadingBlast}
          />
          <BlastRadiusCard blastResult={blastResult} />
        </div>
      </main>
    </div>
  );
}
