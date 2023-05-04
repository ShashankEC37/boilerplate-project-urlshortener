const express = require('express');
const bodyParser = require('body-parser');
const validUrl = require('valid-url');
const dns = require('dns');
const cors = require('cors');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

let urls = [];
let count = 0;



app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


app.post('/api/shorturl', (req, res) => {
  const { url } = req.body;

  // Check if URL is valid
  if (!validUrl.isUri(url)) {
    return res.json({ error: 'invalid url' });
  }

  // Verify URL
  const { hostname } = new URL(url);
  dns.lookup(hostname, (err, address) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    }

    const shortUrl = Math.floor(Math.random() * 10000);
    urls.push({ original_url: url, short_url: shortUrl });

    return res.json({ original_url: url, short_url: shortUrl });
  });
});

app.get('/api/shorturl/:shortUrl', (req, res) => {
  const { shortUrl } = req.params;
  const urlData = urls.find(url => url.short_url === +shortUrl);

  if (!urlData) {
    return res.sendStatus(404);
  }

  return res.redirect(urlData.original_url);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
