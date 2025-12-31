import { MongoClient, Db } from 'mongodb';

let client: MongoClient | undefined;
let database: Db | undefined;

export async function connectToDatabase(): Promise<Db> {
  if (database) {
    return database;
  }

  const databaseUri = process.env.DATABASE_URI;

  if (!databaseUri) {
    throw new Error('DATABASE_URI environment variable is not set');
  }

  if (!client) {
    client = new MongoClient(databaseUri);
    await client.connect();
  }

  database = client.db();
  return database;
}

export async function closeDatabaseConnection(): Promise<void> {
  if (client) {
    await client.close();
    client = undefined;
    database = undefined;
  }
}
