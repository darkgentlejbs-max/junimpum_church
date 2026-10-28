const https = require('https');
https.get({
  host: 'en.wikipedia.org',
  path: '/wiki/Presbyterian_Church_of_Korea_(Tonghap)',
  headers: { 'User-Agent': 'Mozilla/5.0' }
}, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const m = d.match(/upload\.wikimedia\.org[^"]+/g);
    if (m) {
      console.log(m.filter(url => url.includes('logo') || url.includes('svg')));
    }
  });
});
