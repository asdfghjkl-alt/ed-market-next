import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

// Better Auth requires the native MongoDB driver interactions.
// We create a dedicated client for Auth (separate from the Mongoose connection in lib/mongodb.ts)
// but pointing to the SAME database/URI.
const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  // We mirror the "User" model fields here so Better Auth knows about them
  user: {
    modelName: "users", // Explicitly match the collection name "user" from user.model.ts
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "buyer", // Default role
        input: false, // Prevent the client from setting this manually!
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
});
