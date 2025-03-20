// Проверка дали каналот има URL
const hasUrl = (channel) => {
    return channel.url && typeof channel.url === 'string';
  };
  
  module.exports = { hasUrl };