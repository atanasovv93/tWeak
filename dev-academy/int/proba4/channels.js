import puppeteer from 'puppeteer-extra';
import { promises as fs } from 'fs';
import path from 'path';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { extractPlayUrl, readJsonFile, saveUpdatedChannels, appendToM3U } from './utils.js';

const CHANNELS_FILE_PATH = path.resolve('./channels.json');

async function processChannels() {
  let browser;
  try {
    const channels = await readJsonFile(CHANNELS_FILE_PATH);
    console.log('Processing standard channels:', channels.length);

    puppeteer.use(StealthPlugin());
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    for (const channel of channels) {
      console.log(`Processing: ${channel.name} (${channel.id})`);

      if (!channel.playurl && channel.url) {
        const playurl = await extractPlayUrl(page, channel);
        if (playurl) {
          channel.playurl = playurl;
          console.log(`✅ Updated: ${channel.name}`);
          await saveUpdatedChannels(channels);
          await appendToM3U(channel);
        }
      }
    }
  } catch (error) {
    console.error('Error processing channels:', error);
  } finally {
    if (browser) await browser.close();
  }
}

export { processChannels };
