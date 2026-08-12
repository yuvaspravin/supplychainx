const { driver } = require("../config/database");

async function seedDatabase() {
  const session = driver.session();
  try {
    console.log("Cleaning existing database nodes...");
    await session.run("MATCH (n) DETACH DELETE n");

    console.log("Seeding SupplyChainX data...");

    const seedCypher = `
      // Companies (Suppliers)
      CREATE (c1:Company {id: 'COMP-101', name: 'TSMC Silicon Foundry', country: 'Taiwan', tier: 3, riskScore: 88})
      CREATE (c2:Company {id: 'COMP-102', name: 'Foxconn Assembly Hub', country: 'China', tier: 1, riskScore: 42})
      CREATE (c3:Company {id: 'COMP-103', name: 'Samsung Display Corp', country: 'South Korea', tier: 2, riskScore: 35})
      CREATE (c4:Company {id: 'COMP-104', name: 'LithiumTech Mining', country: 'Australia', tier: 3, riskScore: 78})

      // Components
      CREATE (p1:Component {id: 'PART-A16', name: '5nm Processor SoC', category: 'Semiconductor', leadTimeDays: 90})
      CREATE (p2:Component {id: 'PART-OLED', name: 'LTPO OLED Panel', category: 'Display', leadTimeDays: 45})
      CREATE (p3:Component {id: 'PART-BATT', name: '4500mAh Solid-State Cell', category: 'Power', leadTimeDays: 60})

      // Products
      CREATE (prod1:Product {id: 'PROD-X', name: 'Enterprise Phone Pro 15', sku: 'EPP-15-2026', price: 1199})
      CREATE (prod2:Product {id: 'PROD-Y', name: 'AeroTab Ultra 12', sku: 'ATU-12-2026', price: 899})

      // Relationships
      CREATE (c1)-[:SUPPLIES {contractVal: '$12M', primary: true}]->(c2)
      CREATE (c4)-[:SUPPLIES {contractVal: '$8M', primary: true}]->(c2)
      CREATE (c1)-[:MANUFACTURING]->(p1)
      CREATE (c3)-[:MANUFACTURING]->(p2)
      CREATE (c4)-[:MANUFACTURING]->(p3)

      CREATE (p1)-[:ASSEMBLED_INTO {quantityPerUnit: 1}]->(prod1)
      CREATE (p2)-[:ASSEMBLED_INTO {quantityPerUnit: 1}]->(prod1)
      CREATE (p3)-[:ASSEMBLED_INTO {quantityPerUnit: 1}]->(prod1)
      CREATE (p2)-[:ASSEMBLED_INTO {quantityPerUnit: 1}]->(prod2)
    `;

    await session.run(seedCypher);
    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    await session.close();
    await driver.close();
  }
}

seedDatabase();
