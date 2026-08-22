import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

let authInstance;
let mongoClient;
let database;

function requiredEnvironmentVariable(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getAllowedOrigins(baseURL) {
  const configuredOrigins = process.env.BETTER_AUTH_TRUSTED_ORIGINS
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return [...new Set([baseURL, ...(configuredOrigins || [])].filter(Boolean))];
}

export function getAuth() {
  if (authInstance) return authInstance;

  const mongoURI = requiredEnvironmentVariable("MONGO_URI");
  const secret = requiredEnvironmentVariable("BETTER_AUTH_SECRET");
  const baseURL = process.env.BETTER_AUTH_URL?.trim();

  if (process.env.NODE_ENV === "production" && !baseURL) {
    throw new Error("Missing required environment variable: BETTER_AUTH_URL");
  }

  mongoClient = new MongoClient(mongoURI, {
    appName: "SunCart",
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  });

  database = mongoClient.db(process.env.MONGO_DB_NAME?.trim() || "sun-cart");
  const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const socialProviders = {};

  if (googleClientId && googleClientSecret) {
    socialProviders.google = {
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    };
  }

  authInstance = betterAuth({
    appName: "SunCart",
    ...(baseURL ? { baseURL } : {}),
    trustedOrigins: getAllowedOrigins(baseURL),
    secret,
    database: mongodbAdapter(database, { client: mongoClient }),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      maxPasswordLength: 128,
    },
    ...(Object.keys(socialProviders).length > 0 ? { socialProviders } : {}),
    advanced: {
      useSecureCookies: process.env.NODE_ENV === "production",
    },
    rateLimit: {
      enabled: true,
      window: 10,
      max: 100,
    },
  });

  return authInstance;
}

export function getDatabase() {
  getAuth();
  return database;
}
