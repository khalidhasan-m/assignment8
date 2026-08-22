import { getDatabase } from "@/lib/auth";

let indexesPromise;

export function getOrdersCollection() {
  const database = getDatabase();
  const collection = database.collection("orders");

  if (!indexesPromise) {
    indexesPromise = Promise.all([
      collection.createIndex({ userId: 1, createdAt: -1 }),
      collection.createIndex({ orderNumber: 1 }, { unique: true }),
      collection.createIndex({ userId: 1, idempotencyKey: 1 }, { unique: true }),
    ]).catch((error) => {
      indexesPromise = undefined;
      throw error;
    });
  }

  return { collection, indexesPromise };
}

let inventoryIndexesPromise;

export async function reserveProduct(productId, quantity, product) {
  const database = getDatabase();
  const inventory = database.collection("inventory");
  if (!inventoryIndexesPromise) {
    inventoryIndexesPromise = inventory.createIndex({ productId: 1 }, { unique: true }).catch((error) => {
      inventoryIndexesPromise = undefined;
      throw error;
    });
  }
  await inventoryIndexesPromise;
  try {
    await inventory.updateOne(
      { productId },
      { $setOnInsert: { productId, name: product.name, stock: product.stock, updatedAt: new Date() } },
      { upsert: true },
    );
  } catch (error) {
    if (error?.code !== 11000) throw error;
  }

  const reserved = await inventory.findOneAndUpdate(
    { productId, stock: { $gte: quantity } },
    { $inc: { stock: -quantity }, $set: { updatedAt: new Date() } },
    { returnDocument: "after" },
  );

  if (!reserved) throw new Error(`Insufficient stock for product ${productId}`);
  return reserved;
}

export async function releaseProduct(productId, quantity) {
  const database = getDatabase();
  await database.collection("inventory").updateOne(
    { productId },
    { $inc: { stock: quantity }, $set: { updatedAt: new Date() } },
  );
}
