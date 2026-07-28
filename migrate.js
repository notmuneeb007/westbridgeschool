require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const User = require('./models/User');

const USERS_FILE = path.join(__dirname, 'data', 'users.json');

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB');

    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));

    for (const u of users) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        await User.create({
          name: u.name,
          email: u.email,
          password: u.password,
          avatar: u.avatar || null,
          verified: u.verified || false,
          createdAt: new Date(u.createdAt),
        });
        console.log(`Migrated: ${u.email}`);
      } else {
        console.log(`Skipped (exists): ${u.email}`);
      }
    }

    console.log('Migration complete!');
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err.message);
    process.exit(1);
  }
}

migrate();
