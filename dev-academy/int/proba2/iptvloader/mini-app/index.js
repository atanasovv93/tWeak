import puppeteer from 'puppeteer';
import fs from 'fs/promises';

const channels = JSON.parse(await fs.readFile('./data/channels.json', 'utf8'));
const mkdChannels = JSON.parse(await fs.readFile('./data/channelsmk.json', 'utf8'));

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const networkRequests = new Set();

    page.on('request', async request => {
        if ((request.resourceType() === 'xhr' || request.resourceType() === 'fetch') && request.url().includes('mono.m3u8')) {
            if (!networkRequests.has(request.url())) {
                networkRequests.add(request.url());
                const channelId = channels[networkRequests.size - 1].id;
                const m3uContent = [
                    `#EXTINF:0 type="stream" channelId="${channelId}" group="${channels[networkRequests.size - 1].category}", ${channels[networkRequests.size - 1].name}`,
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
        await page.goto(channel.url, { waitUntil: 'networkidle2' });
        await new Promise(resolve => setTimeout(resolve, 5000));

        const videoPlaceholder = await page.$('.video-placeholder');
if (videoPlaceholder) {
    console.log('Video placeholder found. Clicking...');
    await videoPlaceholder.click();
    console.log('Clicked on video placeholder.');

    // Wait for the iframe to load after clicking
    const iframe = await page.$('iframe');
    if (iframe) {
        const iframeSrc = await iframe.evaluate(el => el.src);
        console.log('Iframe video URL:', iframeSrc);

        // Check if the URL is a valid m3u8 link or the one you expect
        if (iframeSrc.includes('video.m3u8')) {
            networkRequests.add(iframeSrc);

            // Assuming `combinedChannels` is an array of channel objects
            const channel = combinedChannels.find(ch => ch.url === channel.url);
            if (channel) {
                channel.playurl = iframeSrc;

                // Save the updated list with the playurl field
                await fs.writeFile('./export/newlist.json', JSON.stringify(combinedChannels, null, 4), 'utf8');
                console.log("Updated list with playurl field has been saved to ./export/newlist.json");
            }
        } else {
            console.log('Iframe does not contain valid video URL.');
        }
    } else {
        console.log('No iframe found after clicking the video placeholder.');
    }
} else {
    console.log('No video placeholder found.');
                continue; // Continue to the next channel if no video is detected
            }
        }

        await new Promise(resolve => setTimeout(resolve, 10000));

    for (let channel of mkdChannels) {
        console.log(`Navigating to ${channel.name}: ${channel.url}`);
        await page.goto(channel.url, { waitUntil: 'networkidle2' });
        await new Promise(resolve => setTimeout(resolve, 5000));

        let m3uFound = false;
        page.on('response', async response => {
            if (response.url().includes('mono.m3u8')) {
                m3uFound = true;
                const channelId = channel.id;
                const m3uContent = [
                    `#EXTINF:0 type="stream" channelId="${channelId}" group="${channel.category}", ${channel.name}`,
                    response.url()
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
        });

        for (let i = 0; i < 2; i++) {
            if (m3uFound) break;
            await new Promise(resolve => setTimeout(resolve, 5000));
            if (!m3uFound) {
                console.log(`Reloading ${channel.name}`);
                await page.reload({ waitUntil: 'networkidle2' });
            }
        }

        if (!m3uFound) {
            console.log(`Skipping ${channel.name} as m3u list not found.`);
        }
    }

    await browser.close();
})();