const mongoose = require('mongoose');
require('dotenv').config();

const clearDB = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected.');

    const collections = ['users', 'tasks', 'teams'];
    
    for (const collectionName of collections) {
      console.log(`🧹 Clearing collection: ${collectionName}...`);
      await mongoose.connection.db.collection(collectionName).deleteMany({});
    }

    console.log('\n✨ Database successfully wiped clean!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Reset failed:', err);
    process.exit(1);
  }
};

clearDB();
