
import puppeteer from 'puppeteer';
import fs from 'fs/promises';

export async function processMkdChannels(mkdChannels) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

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
                    `#EXTINF:0 type="stream" channelId="${channels[networkRequests.size - 1].id}" group="${channels[networkRequests.size - 1].category}", ${channels[networkRequests.size - 1].name}`,
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
                    console.log(`Appending to m3u file: ${m3uContent.join('')}`);
                    await fs.appendFile('./network_requests.m3u', m3uContent.join('') + '\n', 'utf8');
                } else {
                    console.log(`Channel ID already exists in m3u file: ${channelId}`);
                }
            }
        });

        for (let i = 0; i < 2; i++) {
            if (m3uFound) break;
            await new Promise(resolve => setTimeout(resolve, 10000));
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
}
