import { Client, Account, Databases, Storage, Query } from 'appwrite';

// Appwrite configuration using environment variables
export const appwriteConfig = {
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID || "641afe92e77b610a570e",
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1",
  bucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID || "68b2bd14003b3416995b",
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID || "main",
  userCollectionId: import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID || "users",
  sopCollectionId: import.meta.env.VITE_APPWRITE_SOP_COLLECTION_ID || "sops",
  progressCollectionId: import.meta.env.VITE_APPWRITE_PROGRESS_COLLECTION_ID || "progress",
};

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

// Initialize services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export default client;