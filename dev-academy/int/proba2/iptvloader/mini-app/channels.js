import puppeteer from 'puppeteer';
import fs from 'fs/promises';

export async function processChannels(channels) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const networkRequests = new Set();

    page.on('request', async request => {
        if ((request.resourceType() === 'xhr' || request.resourceType() === 'fetch') && request.url().includes('mono.m3u8')) {
            const channel = channels.find(ch => request.url().includes(ch.shortcut));
            if (channel && !networkRequests.has(request.url())) {
                networkRequests.add(request.url());
                const channelId = channel.id;
                const m3uContent = [
                    `#EXTINF:0 type="stream" channelId="${channelId}" group="${channel.category}", ${channel.name}`,
                    request.url()
                ];

                // Проверка дали ID веќе постои во фајлот
                let existingContent = '';
                try {
                    existingContent = await fs.readFile('./network_requests.m3u', 'utf8');
                } catch (err) {
                    if (err.code !== 'ENOENT') throw err;
                }

                if (!existingContent.includes(`channelId="${channelId}"`)) {
                    console.log(`Appending to m3u file: ${m3uContent.join('\n')}`);
                    await fs.appendFile('./network_requests.m3u', m3uContent.join('\n') + '\n', 'utf8');
                } else {
                    console.log(`Channel ID already exists in m3u file: ${channelId}`);
                }
            }
        }
    });

    for (let channel of channels) {
        console.log(`Navigating to ${channel.name}: ${channel.url}`);
        try {
            await page.goto(channel.url, { waitUntil: 'networkidle2' });
        } catch (error) {
            console.error(`Error navigating to ${channel.url}:`, error);
            continue; // Skip to the next channel if navigation fails
        }
        await new Promise(resolve => setTimeout(resolve, 6000));

        const videoPlaceholder = await page.$('.video-placeholder');
        if (videoPlaceholder) {
            await videoPlaceholder.click();
            console.log('Clicked on video placeholder.');
        } else {
            const isPlaying = await page.evaluate(() => {
                const video = document.querySelector('video');
                return video && !video.paused;
            });

            if (isPlaying) {
                console.log('Video is already playing (autoplay enabled).');
                const autoplayUrl = await page.evaluate(() => {
                    const video = document.querySelector('video');
                    return video ? video.src : null;
                });

                if (autoplayUrl && !networkRequests.has(autoplayUrl)) {
                    networkRequests.add(autoplayUrl);
                    const channelId = channel.id;
                    const m3uContent = [
                        `#EXTINF:0 type="stream" channelId="${channelId}" group="${channel.category}", ${channel.name}`,
                        autoplayUrl
                    ];

                    // Проверка дали ID веќе постои во фајлот
                    let existingContent = '';
                    try {
                        existingContent = await fs.readFile('./network_requests.m3u', 'utf8');
                    } catch (err) {
                        if (err.code !== 'ENOENT') throw err;
                    }

                    if (!existingContent.includes(`channelId="${channelId}"`)) {
                        console.log(`Appending to m3u file: ${m3uContent.join('\n')}`);
                        await fs.appendFile('./network_requests.m3u', m3uContent.join('\n') + '\n', 'utf8');
                    } else {
                        console.log(`Channel ID already exists in m3u file: ${channelId}`);
                    }
                }
            } else {
                console.log('No video detected. Moving to next channel...');
                continue; // Continue to the next channel if no video is detected
            }
        }

        await new Promise(resolve => setTimeout(resolve, 10000));
    }

    await browser.close();
}