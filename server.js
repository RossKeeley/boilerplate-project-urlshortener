require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

const links = [];
let id = 0;

app.post('/api/shorturl/new', (req, res) => {
  const { url } = req.body;

  const noHTTPSurl = url.replace(/^https?:\/\//, '');

  // check if this is a valid shorturl
  dns.lookup(noHTTPSurl, (err) => {
    if (err) {
      return res.json({
        error: "invalid URL"
      });
    } else {
      // Increment id
      id++;
      // Create new entry for array
      const link =
      {
        original_url: url,
        short_url: `${id}`
      };
      // Return this new entry
      links.push(link);
      return res.json(link);
    }
  });
})

app.get('/api/shorturl/:id', (req, res) => {
  const { id } = req.params;
  const link = links.find(l => l.short_url === id);
  if (link) {
      return res.redirect(link.original_url);
  } else {
    return res.json({
      error: 'No short url'
    });
  }
});

// Your first API endpoint
// app.get('/api/hello', (req, res) => {
//   res.json({ greeting: 'hello API' });
// });

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
