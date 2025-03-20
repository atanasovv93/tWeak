import { promises as fs } from 'fs';
import path from 'path';

const ALL_CHANNELS_FILE_PATH = path.resolve('./allchannels.json');
const M3U_FILE_PATH = path.resolve('./network_requests.m3u');

async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
}

async function saveUpdatedChannels(channels) {
  try {
    await fs.writeFile(ALL_CHANNELS_FILE_PATH, JSON.stringify(channels, null, 2), 'utf-8');
    console.log('✅ Saved updated channels to allchannels.json');
  } catch (error) {
    console.error('❌ Error saving allchannels.json:', error);
  }
}

async function appendToM3U(channel) {
  try {
    const m3uEntry = `#EXTINF:0 type="stream" channelId="${channel.id}" group="${channel.category}", ${channel.name}\n${channel.playurl}\n`;

    let existingContent = '';
    try {
      existingContent = await fs.readFile(M3U_FILE_PATH, 'utf-8');
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }

    if (!existingContent.includes(`channelId="${channel.id}"`)) {
      console.log(`Appending to M3U: ${channel.name}`);
      await fs.appendFile(M3U_FILE_PATH, m3uEntry, 'utf8');
    } else {
      console.log(`Channel already in M3U: ${channel.name}`);
    }
  } catch (error) {
    console.error('❌ Error appending to M3U:', error);
  }
}

async function extractPlayUrl(page, channel) {
  try {
    console.log(`🌐 Visiting: ${channel.url}`);

    let playurl = null;

    // Enable request interception
    await page.setRequestInterception(true);

    // Use a Set to track intercepted request URLs
    const handledRequests = new Set();

    page.on('request', request => {
      const url = request.url();

      // Check if this request has already been handled
      if (handledRequests.has(url)) {
        request.continue();
        return;
      }

      const blockedDomains = [
        'adservice.google.com',
        'ads.yahoo.com',
        'ads.doubleclick.net',
        'cdn.jsdelivr.net',
      ];

      // Block requests to specific domains
      if (blockedDomains.some(domain => url.includes(domain))) {
        console.log(`🚫 Blocking request to: ${url}`);
        request.abort();
      } else {
        // Mark the request as handled
        handledRequests.add(url);
        request.continue();
      }
    });

    await page.goto(channel.url, { waitUntil: 'networkidle2' });

    const isMacedonianChannel = channel.url.includes('tvstanici.net');
    const selectedSelector = isMacedonianChannel ? '.poster-icon' : '.video-placeholder';

    // Wait for the selector to appear before clicking
    try {
      await page.waitForSelector(selectedSelector, { timeout: 10000 });
      await page.click(selectedSelector);
    } catch (error) {
      console.error(`❌ Error: Element with selector ${selectedSelector} not found on ${channel.url}`);
      return null;
    }

    // Adding some delay to wait for the second interaction
    await new Promise(resolve => setTimeout(resolve, 8000));
    await page.click(selectedSelector);
    await new Promise(resolve => setTimeout(resolve, 20000));

    return playurl;
  } catch (error) {
    console.error(`❌ Error extracting playurl for ${channel.name}:`, error);
    return null;
  }
}

