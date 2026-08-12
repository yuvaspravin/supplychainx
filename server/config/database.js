const neo4j = require("neo4j-driver");
require("dotenv").config();

const uri = process.env.COGNODB_URI;
const user = process.env.COGNODB_USER || process.env.COGNODB_USERNAME;
const password = process.env.COGNODB_PASSWORD;

// Explicit Environment Guard
if (!uri || !user || !password) {
  throw new Error(
    "CRITICAL CONFIGURATION ERROR: Missing required environment variables (COGNODB_URI, COGNODB_USER/COGNODB_USERNAME, COGNODB_PASSWORD).",
  );
}

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password), {
  maxConnectionPoolSize: 50,
  connectionTimeout: 20000,
  maxConnectionLifetime: 3 * 60 * 1000,
  disableLosslessIntegers: true,
});

const runQueryWithRetry = async (cypherQuery, params = {}, maxRetries = 3) => {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const session = driver.session();
    try {
      return await session.run(cypherQuery, params);
    } catch (error) {
      lastError = error;
      console.warn(
        `Query attempt ${attempt}/${maxRetries} failed: ${error.message}`,
      );
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    } finally {
      await session.close();
    }
  }
  throw lastError;
};

module.exports = { driver, runQueryWithRetry };
