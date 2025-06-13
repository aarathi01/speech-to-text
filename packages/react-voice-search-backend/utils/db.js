import mongoose from "mongoose";
import sampleData from "../sampleData.js";

let dbConnection = null;

const itemSchema = new mongoose.Schema({
  id: Number,
  name: String,
  category: String,
});

export const Item = mongoose.model("Item", itemSchema);

export async function connectToDB(uri) {
  try {
    if (!uri) throw new Error("MongoDB URI not provided");
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    dbConnection = conn.connection;
    console.log("Connected to MongoDB.");

    // Insert sample data only if empty
    const count = await Item.countDocuments();
    if (count === 0) {
      await Item.insertMany(sampleData);
      console.log("Sample data inserted.");
    } else {
      console.log("Sample data already exists. Skipping insert.");
    }

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await closeDBConnection();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      await closeDBConnection();
      process.exit(0);
    });
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
                  prefixLength: 1,
                },
              },
            },
            {
              autocomplete: {
                query: filteredQuery,
                path: "category",
                fuzzy: {
                  maxEdits: 1,
                  prefixLength: 1,
                },
              },
            },
          ],
        },
        highlight: {
          path: ["name", "category"],
        },
      },
    },
    { $limit: 20 },
    {
      $project: {
        id: 1,
        name: 1,
        category: 1,
        highlights: { $meta: "searchHighlights" },
        score: { $meta: "searchScore" },
      },
    },
  ]);

  return results.map((doc) => ({
    id: doc.id,
    name: doc.name,
    category: doc.category,
    matchedWords: queryWords,
  }));
}

export async function closeDBConnection() {
  try {
    if (dbConnection) {
      await dbConnection.close();
      console.log("MongoDB connection closed.");
    }
  } catch (err) {
    console.error("Error while closing DB connection:", err);
  }
}

export default connectToDB;