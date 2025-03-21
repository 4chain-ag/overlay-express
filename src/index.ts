import OverlayExpress from "./OverlayExpress.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
dotenv.config();

const main = async () => {
  // Ensure the data directory exists
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // We'll make a new server for our overlay node.
  const server = new OverlayExpress(
    // Name your overlay node from environment variable
    process.env.NODE_NAME || "testnode",

    // Provide the private key that gives your node its identity
    process.env.SERVER_PRIVATE_KEY!,

    // Provide the HTTPS URL where your node is available on the internet
    process.env.HOSTING_URL!,

    // Optional admin token
    process.env.ADMIN_TOKEN
  );

  // Configure port from environment variable
  server.configurePort(parseInt(process.env.PORT || "8080"));

  // Configure network if specified
  if (process.env.NETWORK === "main" || process.env.NETWORK === "test") {
    server.configureNetwork(process.env.NETWORK);
  }

  // Configure ARC API key if provided
  if (process.env.ARC_API_KEY) {
    server.configureArcApiKey(process.env.ARC_API_KEY);
  }

  // Configure verbose logging if enabled
  if (process.env.VERBOSE_LOGGING === "true") {
    server.configureVerboseRequestLogging(true);
  }

  // Connect to your SQL database with Knex
  await server.configureKnex(process.env.KNEX_URL!);

  // Configure MongoDB if MONGO_URL is provided
  if (process.env.MONGO_URL) {
    await server.configureMongo(process.env.MONGO_URL);
  }

  // Disable GASP sync as in the example
  server.configureEnableGASPSync(process.env.ENABLE_GASP_SYNC === "true");

  // Configure engine parameters to simplify setup
  server.configureEngineParams({
    // Use "scripts only" to avoid needing a full chain tracker
    chainTracker: "scripts only",
    // Disable syncConfiguration to avoid complex setup
    syncConfiguration: {},
    // Don't throw on broadcast failures for easier testing
    throwOnBroadcastFailure: false,
  });

  // Log the server details
  console.log(`
========================================
🚀 Starting Overlay Express Server
----------------------------------------
🔗 Node Name: ${process.env.NODE_NAME || "testnode"}
🌐 Hosting URL: ${process.env.HOSTING_URL}
🔌 Port: ${process.env.PORT || "8080"}
🌍 Network: ${process.env.NETWORK || "main"}
💾 Database: ${process.env.KNEX_URL?.includes("mysql") ? "MySQL" : "SQLite"}
🧠 MongoDB: ${process.env.MONGO_URL ? "Configured" : "Not Configured"}
⚙️ GASP Sync: ${process.env.ENABLE_GASP_SYNC === "true" ? "Enabled" : "Disabled"}
========================================
  `);

  // Lastly, configure the engine and start the server!
  // NOTE: We set autoConfigureShipSlap to true to use MongoDB for SHIP and SLAP services
  await server.configureEngine(true);
  await server.start();

  // Log the admin token if it was auto-generated
  if (!process.env.ADMIN_TOKEN) {
    console.log(
      `Admin token (save this for admin access): ${server.getAdminToken()}`
    );
  }
};

// Happy hacking :)
main().catch((err) => {
  console.error("Error starting the server:", err);
  process.exit(1);
});
