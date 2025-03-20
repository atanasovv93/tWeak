import puppeteer from 'puppeteer-extra';
import { promises as fs } from 'fs';
import path from 'path';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { extractPlayUrl, readJsonFile, saveUpdatedChannels, appendToM3U } from './utils.js';

const OTHERS_FILE_PATH = path.resolve('./others.json');

async function processOthers() {
  let browser;
  try {
    const channels = await readJsonFile(OTHERS_FILE_PATH);
    console.log('Processing other channels:', channels.length);

    puppeteer.use(StealthPlugin());
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    for (const channel of channels) {
      console.log(`Processing Other: ${channel.name} (${channel.id})`);

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
    console.error('Error processing other channels:', error);
  } finally {
    if (browser) await browser.close();
  }
}

export { processOthers };
