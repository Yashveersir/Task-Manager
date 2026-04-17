const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    const users = await User.find({});
    console.log(`Checking ${users.length} users...`);

    for (const user of users) {
      // Handle the case where the user still has the old 'team' field in the raw document
      // Mongoose might already expose it via some means or we might need raw access
      const rawUser = await mongoose.connection.db.collection('users').findOne({ _id: user._id });
      
      const teamId = rawUser.team || rawUser.activeTeam;
      
      if (teamId) {
        console.log(`Migrating user: ${user.email}`);
        await mongoose.connection.db.collection('users').updateOne(
          { _id: user._id },
          { 
            $set: { activeTeam: teamId, teams: [teamId] },
            $unset: { team: "" } 
          }
        );
      }
    }

    console.log('Migration completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
};

migrate();
