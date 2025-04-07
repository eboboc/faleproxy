const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to fetch and modify content
app.post('/fetch', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Fetch the content from the provided URL
    const response = await axios.get(url);
    const html = response.data;

    // Use cheerio to parse HTML and selectively replace text content, not URLs
    const $ = cheerio.load(html);
    
    // Function to replace text but skip URLs and attributes
    function replaceYaleWithFale(i, el) {
      if ($(el).children().length === 0 || $(el).text().trim() !== '') {
        // Get the HTML content of the element
        let content = $(el).html();
        
        // Only process if it's a text node
        if (content && $(el).children().length === 0) {
          // Replace Yale with Fale in text content only
          content = content.replace(/Yale/g, 'Fale').replace(/yale/g, 'fale').replace(/YALE/g, 'FALE');
          $(el).html(content);
        }
      }
    }
    
    // Process text nodes in the body
    $('body *').contents().filter(function() {
      return this.nodeType === 3; // Text nodes only
    }).each(function() {
      // Replace text content but not in URLs or attributes
      const text = $(this).text();
      // Only replace if Yale/yale/YALE is present as a word
      let newText = text;
      if (text.match(/\bYale\b|\byale\b|\bYALE\b/)) {
        // Preserve case when replacing
        newText = text
          .replace(/\bYALE\b/g, 'FALE')
          .replace(/\bYale\b/g, 'Fale')
          .replace(/\byale\b/g, 'fale');
      }
      if (text !== newText) {
        $(this).replaceWith(newText);
      }
    });
    
    // Process title separately
    const titleText = $('title').text();
    let newTitle = titleText;
    if (titleText.match(/\bYale\b|\byale\b|\bYALE\b/)) {
      newTitle = titleText
        .replace(/\bYALE\b/g, 'FALE')
        .replace(/\bYale\b/g, 'Fale')
        .replace(/\byale\b/g, 'fale');
    }
    $('title').text(newTitle);
    
    return res.json({ 
      success: true, 
      content: $.html(),
      title: newTitle,
      originalUrl: url
    });
  } catch (error) {
    console.error('Error fetching URL:', error.message);
    return res.status(500).json({ 
      error: `Failed to fetch content: ${error.message}` 
    });
  }
});

// Start the server if not being imported (for local development)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Faleproxy server running at http://localhost:${PORT}`);
  });
}

// Export the app for serverless environments like Vercel
module.exports = app;
