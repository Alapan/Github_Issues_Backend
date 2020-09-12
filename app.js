const cors = require('cors');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();

const app = express();
const { Octokit } = require('@octokit/core');
const PORT = 8000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const corsOptions = {
  origin: 'http://localhost:3000'
};

const octokit = new Octokit({ auth: process.env.PERSONAL_ACCESS_TOKEN });

/* GET total number of issues for a repo */
app.get('/issues/:owner/:repo/count', cors(corsOptions), (req, res) => {
  const {repo} = req.params;
  const {owner} = req.params;

  Promise.all([
    octokit.request('GET /search/issues', {
      q: `repo:${owner}/${repo}+type:issue+state:closed`
    }),
    octokit.request('GET /search/issues', {
      q: `repo:${owner}/${repo}+type:issue+state:open`
    })
  ]).then((response) => {
    // Return total number of closed + open issues
    console.log('CLOSED COUNT: ', response[0].data.total_count);
    console.log('OPEN COUNT: ', response[1].data.total_count);
    res.json({ total_count: (response[0].data.total_count + response[1].data.total_count) });
  });
});

/* GET issues listing. */
app.get('/issues/:owner/:repo', cors(corsOptions), (req, res) => {
  const {repo} = req.params;
  const {owner} = req.params;
  octokit.request('GET /repos/{owner}/{repo}/issues', {owner, repo})
    .then((response) => {
      res.json(response.data);
    })
});

/* GET events for an issue */
app.get('/issues/:owner/:repo/:issue_number/events', cors(corsOptions), (req, res) => {
  const {repo} = req.params;
  const {owner} = req.params;
  const {issue_number} = req.params;
  octokit.request('GET /repos/{owner}/{repo}/issues/{issue_number}/events', {
    owner,
    repo,
    issue_number
  })
    .then((response) => {
      res.json(response.data);
    })
});

/* GET details for a particular event */
app.get('/issues/:owner/:repo/events/:event_id', cors(corsOptions), (req, res) => {
  const {repo} = req.params;
  const {owner} = req.params;
  const {event_id} = req.params;
  octokit.request('GET /repos/{owner}/{repo}/issues/events/{event_id}', {
    owner,
    repo,
    event_id
  })
    .then((response) => {
      res.json(response.data);
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

if (!module.parent) {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

module.exports = app;
