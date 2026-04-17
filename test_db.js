const mongoose = require('mongoose');
const Task = require('./backend/src/models/Task');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });
mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const task = await Task.findOne();
    if(task) {
        console.log('Task status before:', task.status);
        task.status = 'done';
        await task.save();
        console.log('Task status updated to done via script.');
    } else {
        console.log('No tasks found');
    }
    process.exit(0);
}).catch(console.error);
