import puppeteer from 'puppeteer-extra';
import { promises as fs } from 'fs';
import path from 'path';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const CHANNELS_FILE_PATH = path.resolve(__dirname, './channels.json');
const CHANNELSMK_FILE_PATH = path.resolve(__dirname, './channelsmk.json');
const ALL_CHANNELS_FILE_PATH = path.resolve(__dirname, './allchannels.json');
const M3U_FILE_PATH = path.resolve(__dirname, './network_requests.m3u');

async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`❌ Error reading ${filePath}:`, error);
    return [];
  }
}

async function processChannels() {
  let browser;
  try {
    const channelsmk = await readJsonFile(CHANNELSMK_FILE_PATH);
    // const channels = await readJsonFile(CHANNELS_FILE_PATH);
    const allChannels = [...channelsmk];
    console.log('📡 Processing channels:', allChannels.length);

    puppeteer.use(StealthPlugin());
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    for (const channel of allChannels) {
      console.log(`🔍 Processing channel: ${channel.name} (${channel.id})`);

      if (!channel.playurl && channel.url) {
        const playurl = await extractPlayUrl(page, channel);
        if (playurl) {
          if (channel.playurl !== playurl) {
            channel.playurl = playurl;
            console.log(`✅ Updated playurl for ${channel.name}: ${playurl}`);
            await fs.writeFile(ALL_CHANNELS_FILE_PATH, JSON.stringify(allChannels, null, 2), 'utf-8');
          }
          const m3uContent = `#EXTINF:-1 tvg-id="${channel.id}" tvg-name="${channel.name}" tvg-logo="" group-title="${channel.category}", ${channel.name}
${playurl}\n`;
          let existingContent = '';
          try {
            existingContent = await fs.readFile(M3U_FILE_PATH, 'utf-8');
          } catch (err) {}
          if (!existingContent.includes(`channelId="${channel.id}"`)) {
            await fs.appendFile(M3U_FILE_PATH, m3uContent, 'utf8');
          }
        }
      }
    }
  } catch (error) {
    console.error('❌ Error processing channels:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function extractPlayUrl(page, channel) {
  try {
    console.log(`🌐 Visiting: ${channel.url}`);
    let playurl = null;
    page.on('request', request => {
      if ((request.resourceType() === 'xhr' || request.resourceType() === 'fetch') && request.url().includes('.m3u8')) {
        playurl = request.url();
      }
    });
    await page.goto(channel.url, { waitUntil: 'networkidle2' });

    await page.evaluate(() => {
      const script = document.querySelector('script[disable-devtool-auto]');
      if (script) {
        script.remove();
        console.log('✅ Removed disable-devtool script.');
      }
    });

    const selectedSelector = channel.url.includes('tvstanici.net') ? '.poster-icon' : '.video-placeholder';
                              channel.url.includes('bg-gledai.video') ? '.play-wrapper .poster-icon' :
                             '.video-placeholder';
    const austrianSelector = channel.url.includes('2ix2.com') ? '#tvplayer > div.jw-controls.jw-reset > div.jw-display.jw-reset > div > div > div.jw-display-icon-container.jw-display-icon-display.jw-reset' : null;

    const selectedExists = await page.$(selectedSelector);
    if (selectedExists) {
      await page.waitForSelector(selectedSelector, { timeout: 8000 });
      await page.click(selectedSelector);
      await new Promise(resolve => setTimeout(resolve, 2000));
    } else {
      console.warn(`⚠️ Selector not found: ${selectedSelector}`);
    }

    if (austrianSelector) {
      const austrianExists = await page.$(austrianSelector);
      if (austrianExists) {
        await page.waitForSelector(austrianSelector, { timeout: 8000 });
        await page.click(austrianSelector);
      } else {
        console.warn(`⚠️ Selector not found: ${austrianSelector}`);
      }
    }

    await new Promise(resolve => setTimeout(resolve, 10000));
    return playurl;
  } catch (error) {
    console.error(`❌ Error extracting playurl for ${channel.name}:`, error);
    return null;
  }
}

processChannels().catch(err => console.error('❌ Unexpected error:', err));