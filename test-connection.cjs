// filepath: /Users/teddy1606/Projects/AI Chat/ai-chat/test-connection.cjs
const { Client } = require("pg");
require("dotenv").config(); // Load environment variables from .env file

const connectionString = process.env.NEXT_PUBLIC_DATABASE_URL;

const client = new Client({
  connectionString: connectionString,
});

console.log(connectionString);

client
  .connect()
  .then(() => {
    console.log("Connected to the database successfully");
    return client.end();
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });
