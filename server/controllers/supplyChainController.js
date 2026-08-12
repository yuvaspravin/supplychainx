const { runQueryWithRetry } = require("../config/database");

/**
 * GET /api/graph
 */
exports.getGraphData = async (req, res) => {
  try {
    const cypher = `
      MATCH (n)
      OPTIONAL MATCH (n)-[r]->(m)
      RETURN n, r, m
      LIMIT 200
    `;

    const result = await runQueryWithRetry(cypher);
    const nodesMap = new Map();
    const links = [];

    result.records.forEach((record) => {
      const sourceNode = record.get("n");
      const rel = record.get("r");
      const targetNode = record.get("m");

      if (sourceNode && !nodesMap.has(sourceNode.identity.toString())) {
        nodesMap.set(sourceNode.identity.toString(), {
          id: sourceNode.identity.toString(),
          labels: sourceNode.labels,
          properties: sourceNode.properties,
        });
      }

      if (targetNode && !nodesMap.has(targetNode.identity.toString())) {
        nodesMap.set(targetNode.identity.toString(), {
          id: targetNode.identity.toString(),
          labels: targetNode.labels,
          properties: targetNode.properties,
        });
      }

      if (rel) {
        links.push({
          id: rel.identity.toString(),
          source: rel.start.toString(),
          target: rel.end.toString(),
          type: rel.type,
          properties: rel.properties,
        });
      }
    });

    res.status(200).json({
      nodes: Array.from(nodesMap.values()),
      links,
    });
  } catch (error) {
    console.error("Error fetching graph data:", error);
    res.status(500).json({
      error: "Database query failed.",
      details: error.message,
    });
  }
};

/**
 * GET /api/blast-radius/:companyId
 */
exports.getBlastRadius = async (req, res) => {
  const { companyId } = req.params;

  try {
    const cypher = `
      MATCH path = (start:Company {id: $companyId})-[:SUPPLIES|MANUFACTURING|ASSEMBLED_INTO*1..4]->(affected:Product)
      WITH DISTINCT affected, min(length(path)) AS minDepth
      RETURN affected, minDepth AS depth
      ORDER BY minDepth ASC
    `;

    const result = await runQueryWithRetry(cypher, { companyId });

    const impactedProducts = result.records.map((rec) => ({
      product: rec.get("affected").properties,
      depth: rec.get("depth").toNumber(),
    }));

    res.status(200).json({
      sourceCompanyId: companyId,
      totalImpacted: impactedProducts.length,
      impactedProducts,
    });
  } catch (error) {
    console.error("Error computing blast radius:", error);
    res.status(500).json({
      error: "Failed to execute multi-hop query.",
      details: error.message,
    });
  }
};
