import { processChannels } from './channels.js';
import { processChannelsMk } from './channelsmk.js';
import { processOthers } from './others.js';

async function main() {
  console.log('🚀 Starting processing...');

  await processChannels();
  await processChannelsMk();
  await processOthers();

  console.log('🎉 All processing completed!');
}

main().catch(err => console.error('Unexpected error:', err));
