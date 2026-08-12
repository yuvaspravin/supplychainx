const { driver } = require("../config/database");

const seedDatabase = async () => {
  const session = driver.session();

  try {
    const cypher = `
      // Idempotent Node Creation using MERGE
      MERGE (c1:Company {id: 'COMP-101'})
      ON CREATE SET c1.name = 'TSMC Silicon Foundry', c1.country = 'Taiwan', c1.tier = 3, c1.riskScore = 88
      ON MATCH SET c1.name = 'TSMC Silicon Foundry', c1.country = 'Taiwan', c1.tier = 3, c1.riskScore = 88

      MERGE (c2:Company {id: 'COMP-102'})
      ON CREATE SET c2.name = 'Foxconn Assembly Hub', c2.country = 'China', c2.tier = 1, c2.riskScore = 42

      MERGE (p1:Component {id: 'PART-A16'})
      ON CREATE SET p1.name = '5nm Processor SoC', p1.category = 'Semiconductor', p1.leadTimeDays = 90

      MERGE (prod1:Product {id: 'PROD-X'})
      ON CREATE SET prod1.name = 'Enterprise Phone Pro 15', prod1.sku = 'EPP-15-2026', prod1.price = 1199

      // Idempotent Relationship Creation
      MERGE (c1)-[:MANUFACTURING]->(p1)
      MERGE (p1)-[:ASSEMBLED_INTO {quantityPerUnit: 1}]->(prod1)
    `;

    await session.run(cypher);
    console.log("Database seeded idempotently successfully.");
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    await session.close();
    await driver.close();
  }
};

seedDatabase();
