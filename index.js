const posts = require('./posts');
const express = require('express');

const app = express();

posts.initPosts();

app.use(express.static(__dirname + '/frontend/build'));

app.get('/api/posts', (req, res) => {
  res.send(JSON.stringify(posts.fetchAllPosts()));
});

app.listen(process.env.PORT || 5000, () => console.log('Running'));
