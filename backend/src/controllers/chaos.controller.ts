import { Request, Response } from 'express';
import Product from '../models/Product';

/**
 * Artificial API delay (injects 2-5s latency)
 */
export const delay = async (_req: Request, res: Response) => {
  const waitTime = Math.floor(Math.random() * 3000) + 2000;
  setTimeout(() => {
    res.json({
      message: `Artificial delay of ${waitTime}ms completed`,
      waitTime
    });
  }, waitTime);
};

/**
 * Randomly throws 500 errors
 */
export const randomError = (_req: Request, res: Response) => {
  const isError = Math.random() > 0.5;
  if (isError) {
    throw new Error("Controlled chaos: Random 500 internal server error injected");
  }
  res.json({ message: "Lucky you! No error this time." });
};

/**
 * Inefficient database query to spike CPU/latency
 */
export const heavyQuery = async (_req: Request, res: Response) => {
  const startTime = Date.now();
  
  // Perform a expensive regex search or repeated queries
  // to simulate database stress and trace latency
  const iterations = 5;
  let results = [];
  
  for (let i = 0; i < iterations; i++) {
     // A slow-ish query that doesn't use indexes efficiently
     results = await Product.find({
       $or: [
         { name: { $regex: '.*a.*', $options: 'i' } },
         { description: { $regex: '.*e.*', $options: 'i' } }
       ]
     }).limit(100);
  }

  const durationMs = Date.now() - startTime;
  res.json({
    message: "Inefficient query completed",
    iterations,
    itemCount: results.length,
    durationMs
  });
};

/**
 * Returns a large payload to test throughput
 */
export const largePayload = (_req: Request, res: Response) => {
  // Generate a large string (approx 5MB)
  const sizeMb = 5;
  const largeData = 'x'.repeat(sizeMb * 1024 * 1024);
  
  res.json({
    message: `Large payload of ${sizeMb}MB sent`,
    dataLength: largeData.length,
    // We don't actually send the data in the message but as a sibling property
    // to keep the JSON manageable for some clients while still heavy on the wire
    payload: largeData
  });
};
