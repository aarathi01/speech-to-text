import mongoose from "mongoose";
import sampleData from "./sampleData.js";

// Define schema
const itemSchema = new mongoose.Schema({
  id: Number,
  name: String,
  category: String,
});

// Create model
export const Item = mongoose.model("Item", itemSchema);

export async function connectToDB(uri) {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB.");

    // Seed only if DB is empty
    const count = await Item.countDocuments();
    if (count === 0) {
      await Item.insertMany(sampleData);
      console.log("Sample data inserted into MongoDB.");
    } else {
      console.log("Sample data already exists, skipping insert!");
    }
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }
}

// Search function with fuzzy/partial matching
export async function searchInDB(words) {
  if (!Array.isArray(words)) throw new Error("Expected words to be an array");

  const regexes = words.map((word) => new RegExp(word, "i"));
  return await Item.find({
    $or: [{ name: { $in: regexes } }, { category: { $in: regexes } }],
  }).limit(20);
}
