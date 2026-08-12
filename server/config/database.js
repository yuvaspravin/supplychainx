const neo4j = require("neo4j-driver");
require("dotenv").config();

const uri = process.env.COGNODB_URI;
const user = process.env.COGNODB_USER;
const password = process.env.COGNODB_PASSWORD;

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password), {
  maxConnectionPoolSize: 50,
  connectionTimeout: 20000, // Increased timeout to 20s for cloud cold-starts
  maxConnectionLifetime: 3 * 60 * 1000,
});

// Helper function to execute Cypher with automatic retry on cold start
const runQueryWithRetry = async (cypherQuery, params = {}, maxRetries = 3) => {
  let attempts = 0;
  while (attempts < maxRetries) {
    const session = driver.session();
    try {
      const result = await session.run(cypherQuery, params);
      return result;
    } catch (error) {
      attempts++;
      console.warn(
        `CognoDB query attempt ${attempts} failed: ${error.message}`,
      );
      if (attempts >= maxRetries) throw error;
      // Wait 1 second before retrying
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      await session.close();
    }
  }
};

const verifyConnection = async () => {
  try {
    await runQueryWithRetry("RETURN 1 AS result");
    console.log("Successfully connected to CognoDB Graph Database.");
    return true;
  } catch (error) {
    console.error("CognoDB Connection Failed:", error.message);
    return false;
  }
};

module.exports = { driver, runQueryWithRetry, verifyConnection };
