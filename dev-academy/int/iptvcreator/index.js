import mongoose from 'mongoose';
import fs from 'fs';
import dotenv from 'dotenv';

// Конфигурација на .env
dotenv.config();

// Конекција со MongoDB
const MONGO_URI = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`;

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Дефиниција на моделот за канали
const channelSchema = new mongoose.Schema({
  name: String,
  id: Number,
  url: String,
  playurl: String,
});

const Channel = mongoose.model('Channel', channelSchema);

// Функција за генерирање на M3U фајл
async function generateM3UPlaylist() {
  try {
    // Преземи ги сите канали од MongoDB
    const channels = await Channel.find({});

    if (channels.length === 0) {
      console.log('❌ No channels found in MongoDB');
      return;
    }

    // Почеток на M3U фајлот
    let m3uContent = '#EXTM3U\n';

    // Подредување на каналите и додавање во M3U формат
    channels.forEach((channel) => {
      if (channel.playurl) {
        m3uContent += `#EXTINF:-1,${channel.name}\n`;
        m3uContent += `${channel.playurl}\n`;
      }
    });

    // Запишување на M3U фајлот
    fs.writeFileSync('playlist.m3u', m3uContent, 'utf8');
    console.log('✅ playlist.m3u has been generated successfully!');
  } catch (error) {
    console.error('❌ Error generating M3U playlist:', error);
  } finally {
    // Затвори ја конекцијата со MongoDB
    mongoose.connection.close();
  }
}

// Повикај ја функцијата за генерирање на M3U
generateM3UPlaylist();
