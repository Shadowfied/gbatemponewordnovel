const fetch = require('node-fetch');
const parse = require('node-html-parser').parse;
const he = require('he');
const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.resolve(__dirname + '/db.sqlite'));

exports.initPosts = async () => {
  setupDb();

  // Determine which page we should start fetching from
  const latestPageNumber = getLatestPage() ? getLatestPage().pageNumber : '1';

  // Start recursive fetch function
  await fetchPage(
    `threads/lets-write-a-novel-one-word-at-time.575304/page-${latestPageNumber}`
  );
};

// Find and returns all posts
exports.fetchAllPosts = () => {
  return db.prepare('SELECT * FROM posts').all();
};

// Setup the database
const setupDb = () => {
  db.exec(
    'CREATE TABLE IF NOT EXISTS posts (id INT, author TEXT, text TEXT, url TEXT, date TEXT, pageNumber INT)'
  );
};

// Return the last page number fetched from
const getLatestPage = () => {
  const page = db
    .prepare(
      'SELECT pageNumber FROM posts WHERE ID = (SELECT MAX(ID) FROM POSTS)'
    )
    .get();

  return page;
};

// Filter out garbage
const filterMessage = (post) => {
  // Filter out GBAtemp double post notice
  let filteredText = post.replace(
    /— Posts automatically merged - Please don't double post! —/g,
    ''
  );

  // Remove all empty space
  filteredText = filteredText.replace(/[\t\r]|&nbsp;/g, '').trim();

  // If there are linebreaks
  if (filteredText.match(/\n/)) {
    // Only use the content before the linebreak
    filteredText = filteredText.split(/\n/)[0];
  }

  // Split by space
  filteredText = filteredText.split(' ');

  // If there are more than 1 word
  if (filteredText.length > 1) {
    // Allow 2 words
    return `${filteredText[0]} ${filteredText[1]}`;
  }

  return filteredText[0];
};

// Insert a post into the database
const insertPost = (post) => {
  // Check if the post already exists
  const exists = db.prepare(`SELECT id FROM posts WHERE id = ${post.id}`).get();

  if (!exists) {
    // Insert the post
    const insertionStmt = db.prepare(
      'INSERT INTO posts (id, author, text, url, date, pageNumber) VALUES (?, ?, ?, ?, ?, ?)'
    );
    const info = insertionStmt.run(
      post.id,
      post.author,
      post.text,
      post.url,
      post.date,
      post.pageNumber
    );
  }
};

// Recursive function to fetch and parse everything we need to gather from the posts
const fetchPage = async (page) => {
  // Do the fetch
  const toFetch = await fetch(`https://gbatemp.net/${page}`);

  // Get the actual DOM text
  const pageText = await toFetch.text();

  // Parse as DOM so we can query it
  const dom = parse(pageText);

  // Find all posts
  const posts = dom.querySelectorAll('.sectionMain.message .uix_message');

  // Find the current page number
  const currentPage = dom.querySelector('#PageNavDesktop .currentPage').text;

  // Temporary variable for potential link to next page
  let nextLink = '';

  // Iterate each post
  posts.forEach((post) => {
    // Get all nodes inside the content
    let contentNodes = post.querySelector('blockquote.messageText').childNodes;

    // Variable to hold the final text
    let text;

    // Iterate each contentNode - TODO: Move into filterMessage function?
    contentNodes.forEach((node) => {
      // If the node is not a div (e.g. spoiler tag)
      if (node.rawTagName !== 'div') {
        // Decode HTML entities and whitespace
        let checkText = he
          .decode(node.innerText)
          .replace(/[\t\r]|&nbsp;/g, '')
          .trim();
        if (checkText) {
          // If there is anything remaining we know that its the text content we're looking for
          text = checkText;
        }
      }
    });

    // Find the title attribute of the date of the post
    const dateTitle = post.querySelector('.DateTime').getAttribute('title');

    // Variable to hold the final date
    let date;

    // The title attribute oddly doesn't exist on posts that are new
    if (dateTitle) {
      // But if it does we just use it
      date = dateTitle;
    } else {
      // If not, we use the data attribute 'time'
      date = new Date(
        parseInt(post.querySelector('.DateTime').getAttribute('data-time')) *
          1000
      );

      // Turn it into a UTCString just like the title attributes are
      date = date.toUTCString();
    }

    // Insert the post into the db
    insertPost({
      id: post.querySelector('.postNumber').text.replace('#', ''),
      author: post.querySelector('a.username').text,
      text: filterMessage(text),
      url: post.querySelector('.postNumber').getAttribute('href'),
      date: date,
      pageNumber: currentPage,
    });
  });

  // Find the page nav
  const pageNav = dom.querySelector('#PageNavDesktop nav');

  // If the pageNav exists
  if (pageNav) {
    // Find the 'Next' link
    const navNext = pageNav.childNodes[pageNav.childNodes.length - 2];

    // Make sure it's the node we're looking for
    if (navNext.text.includes('Next')) {
      // Store the link
      nextLink = navNext.getAttribute('href');
      // Make sure it's valid
      if (nextLink.match(/page-[0-9]+/g)) {
        // Run the function again on next page
        await fetchPage(nextLink);
      }
    }
  }
};
