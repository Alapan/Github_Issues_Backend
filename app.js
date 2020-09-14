const cors = require('cors');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { Octokit } = require('@octokit/core');

const app = express();
const PORT = 8000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const corsOptions = {
  origin: 'http://localhost:3000',
};

const octokit = new Octokit();
/* GET total number of issues for a repo */
app.get('/issues/:owner/:repo/count', cors(corsOptions), (req, res) => {
  const { repo } = req.params;
  const { owner } = req.params;

  Promise.all([
    octokit.request('GET /search/issues', {
      q: `repo:${owner}/${repo}+type:issue+state:closed`,
    }),
    octokit.request('GET /search/issues', {
      q: `repo:${owner}/${repo}+type:issue+state:open`,
    }),
  ]).then((response) => {
    // Return total number of closed + open issues
    res.json({ total_count: (response[0].data.total_count + response[1].data.total_count) });
  });
});

/* GET issues listing. */
app.get('/issues/:owner/:repo/:page/:perPage', cors(corsOptions), (req, res) => {
  const {
    repo,
    owner,
    page,
    perPage,
  } = req.params;
  octokit.request(`GET /repos/${owner}/${repo}/issues`, { page, per_page: perPage })
    .then((response) => {
      res.json(response.data);
    });
});

/* GET events for an issue */
app.get('/events/:owner/:repo/:issueNumber', cors(corsOptions), (req, res) => {
  const { repo } = req.params;
  const { owner } = req.params;
  const { issueNumber } = req.params;
  octokit.request('GET /repos/{owner}/{repo}/issues/{issue_number}/events', {
    owner,
    repo,
    issue_number: issueNumber,
  })
    .then((response) => {
      res.json(response.data);
    });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
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
