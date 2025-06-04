import mongoose from "mongoose";
import sampleData from "../sampleData.js";
import { highlightField } from "./highlightUtils.js";

const itemSchema = new mongoose.Schema({
  id: Number,
  name: String,
  category: String,
});

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

export async function searchInDB(filteredQuery, queryWords) {
  const results = await Item.aggregate([
    {
      $search: {
        index: "indexName", // your index name here
        compound: {
          should: [
            {
              autocomplete: {
                query: filteredQuery,
                path: "name",
                fuzzy: {
                  maxEdits: 1,
                  prefixLength: 1
                }
              }
            },
            {
              autocomplete: {
                query: filteredQuery,
                path: "category",
                fuzzy: {
                  maxEdits: 1,
                  prefixLength: 1
                }
              }
            }
          ]
        },
        highlight: {
          path: ["name", "category"]
        }
      }
    },
    { $limit: 20 },
    {
      $project: {
        id: 1,
        name: 1,
        category: 1,
        highlights: { $meta: "searchHighlights" },
        score: { $meta: "searchScore" }
      }
    }
  ]);

  return results.map(doc => ({
    id: doc.id,
    name: highlightField(doc.name, doc.highlights, "name"),
    category: highlightField(doc.category, doc.highlights, "category"),
    matchedWords: queryWords
  }));
}

export default connectToDB;