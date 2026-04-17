const mongoose = require('mongoose');
const User = require('./src/models/User');
const Task = require('./src/models/Task');
const Team = require('./src/models/Team');
require('dotenv').config();

const migrateDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected.');

    const defaultTeam = await Team.create({
      name: 'Legacy Global Workspace',
      inviteCode: 'LEGACY123'
    });

    console.log('Created legacy team:', defaultTeam._id);

    const usersUpdate = await User.updateMany({ team: { $exists: false } }, { $set: { team: defaultTeam._id } });
    console.log('Migrated Users:', usersUpdate);

    const tasksUpdate = await Task.updateMany({ team: { $exists: false } }, { $set: { team: defaultTeam._id } });
    console.log('Migrated Tasks:', tasksUpdate);

    console.log('Migration Complete.');
    process.exit(0);
  } catch(e) {
    if (e.code === 11000) {
      console.log('Already migrated');
      process.exit(0);
    }
    console.error(e);
    process.exit(1);
  }
};

migrateDb();
