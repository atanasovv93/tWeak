import puppeteer from 'puppeteer';
import fs from 'fs';

// Функција која ќе извлекува playurl за канали и ќе ги чува во allchannels.json
export async function extractPlayUrl(channelUrl, channelName) {
  const browser = await puppeteer.launch({ headless: true }); // Лансирање на браузер
  const page = await browser.newPage(); // Отворање нова страница

  let playurl = null;

  try {
    console.log(`Navigating to: ${channelUrl}`);

    // Слушање на мрежни барања за да се најде chunks.m3u8
    page.on('request', request => {
      if (
        (request.resourceType() === 'xhr' || request.resourceType() === 'fetch') &&
        request.url().includes('chunks.m3u8?nimblesessionid=')
      ) {
        playurl = request.url();  // Чување на playurl
      }
    });

    // Навигирање до URL-то на каналот
    await page.goto(channelUrl, { waitUntil: 'networkidle2' });
    await page.waitForSelector('.poster-icon', { timeout: 6000 });
    await page.click('.poster-icon');    // Чекање 10 секунди пред да продолжиме
    await new Promise(resolve => setTimeout(resolve, 10000));

    if (!playurl) {
      console.error(`No playurl found for ${channelName}`);
      return null;
    }

    console.log(`Play URL for ${channelName}: ${playurl}`);
    return playurl;

  } catch (error) {
    console.error(`Error extracting playurl for ${channelName}:`, error);
  } finally {
    await browser.close(); // Затворање на браузерот
  }
}

export async function processChannelsMk(channels) {
  const allChannels = [];

  // Процесирање на сите канали
  for (const channel of channels) {
    console.log(`Processing channel: ${channel.name} (${channel.id})`);
    const playurl = await extractPlayUrl(channel.url, channel.name);
    
    if (playurl) {
      allChannels.push({ name: channel.name, id: channel.id, playurl });
    }
  }

  // Записување на резултатите во allchannels.json
  try {
    fs.writeFileSync('allchannels.json', JSON.stringify(allChannels, null, 2));
    console.log('All channels data has been written to allchannels.json');
  } catch (error) {
    console.error('Error writing to allchannels.json:', error);
  }
}
