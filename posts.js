const fetch = require('node-fetch');
const parse = require('node-html-parser').parse;
const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.resolve(__dirname + '/db.sqlite'));

exports.initPosts = async () => {
  setupDb();

  const latestPageNumber = getLatestPage() ? getLatestPage().pageNumber : '1';

  await fetchPage(
    `threads/lets-write-a-novel-one-word-at-time.575304/page-${latestPageNumber}`
  );
};

exports.fetchAllPosts = () => {
  return db.prepare('SELECT * FROM posts').all();
};

const setupDb = () => {
  db.exec(
    'CREATE TABLE IF NOT EXISTS posts (id INT, author TEXT, text TEXT, url TEXT, date TEXT, pageNumber INT)'
  );
};

const getLatestPage = () => {
  const page = db
    .prepare(
      'SELECT pageNumber FROM posts WHERE ID = (SELECT MAX(ID) FROM POSTS)'
    )
    .get();

  return page;
};

const insertPost = (post) => {
  const exists = db.prepare(`SELECT id FROM posts WHERE id = ${post.id}`).get();

  if (!exists) {
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

const fetchPage = async (page) => {
  const toFetch = await fetch(`https://gbatemp.net/${page}`);

  const pageText = await toFetch.text();

  const dom = parse(pageText);

  const posts = dom.querySelectorAll('.sectionMain.message .uix_message');
  const currentPage = dom.querySelector('#PageNavDesktop .currentPage').text;

  let nextLink = '';

  posts.forEach((post) => {
    insertPost({
      id: post.querySelector('.postNumber').text.replace('#', ''),
      author: post.querySelector('a.username').text,
      text: post
        .querySelector('blockquote.messageText')
        .text.replace(/[\n\t\r]|&nbsp;/g, '')
        .trim(),
      url: post.querySelector('.postNumber').getAttribute('href'),
      date: post.querySelector('.DateTime').text,
      pageNumber: currentPage,
    });
  });

  const pageNav = dom.querySelector('#PageNavDesktop nav');

  if (pageNav) {
    const navNext = pageNav.childNodes[pageNav.childNodes.length - 2];

    if (navNext.text.includes('Next')) {
      nextLink = navNext.getAttribute('href');
      if (nextLink.match(/page-[0-9]+/g)) {
        await fetchPage(nextLink);
      }
    }
  }
};
