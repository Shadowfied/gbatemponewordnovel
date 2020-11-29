const posts = require('./posts');
const express = require('express');

// Setup express app
const app = express();

// Fetch any new posts. This is run on every request, but the majority of the job is already done at build time
posts.initPosts();

// Serve static assets from the build folder of the frontend
app.use(express.static(__dirname + '/frontend/build'));

// Expose an endpoint to fetch the posts
app.get('/api/posts', (req, res) => {
  res.send(JSON.stringify(posts.fetchAllPosts()));
});

// Start the server
app.listen(process.env.PORT || 5000, () => console.log('Running'));
