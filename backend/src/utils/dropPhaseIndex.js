const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { connectDB } = require("../config/db.config");

dotenv.config();

// Script to drop the unique index on phaseName
async function dropPhaseNameIndex() {
  try {
    await connectDB();
    
    const db = mongoose.connection.db;
    const collection = db.collection("phases");
    
    // Get all indexes
    const indexes = await collection.indexes();
    console.log("Current indexes:", indexes.map(idx => ({ name: idx.name, key: idx.key, unique: idx.unique })));
    
    // Drop the unique index on phaseName if it exists
    try {
      await collection.dropIndex("phaseName_1");
      console.log("✅ Dropped unique index on phaseName");
    } catch (error) {
      if (error.code === 27 || error.codeName === 'IndexNotFound') {
        console.log("ℹ️  Index 'phaseName_1' does not exist");
      } else {
        console.error("Error dropping index:", error.message);
      }
    }
    
    // Create non-unique index
    try {
      await collection.createIndex({ phaseName: 1 }, { unique: false, name: "phaseName_1" });
      console.log("✅ Created non-unique index on phaseName");
    } catch (error) {
      console.log("ℹ️  Index might already exist:", error.message);
    }
    
    console.log("✅ Index update complete!");
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

dropPhaseNameIndex();

