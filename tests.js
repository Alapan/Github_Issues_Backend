const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const nock = require('nock');
const server = require('./app');

chai.use(chaiHttp);

describe('test Issues APIs', (done) => {
  before(() => {
    nock('https://api.github.com')
      .get('/search/issues?q=repo:Alapan/tic-tac-toe+type:issue+state:closed')
      .reply(200, {
        total_count: 20,
        incomplete_results: false,
        items: []
      });

    nock('https://api.github.com')
      .get('/search/issues?q=repo:Alapan/tic-tac-toe+type:issue+state:open')
      .reply(200, {
        total_count: 10,
        incomplete_results: false,
        items: []
      });

    nock('https://api.github.com')
      .get('/repos/Alapan/tic-tac-toe/issues?page=1&per_page=30')
      .reply(200, [
        { num: 1 },
        { num: 2 }
      ]);

    nock('https://api.github.com')
      .get('/repos/Alapan/tic-tac-toe/issues/3/events')
      .reply(200, [
        { name: 'open event'},
        { name: 'update event'}
      ]);
  });

  after(() => {
    nock.cleanAll();
  });

  it('tests the number of issues returned', async () => {
    const result = await chai.request(server)
      .get('/issues/Alapan/tic-tac-toe/count');
    expect(result.status).to.equal(200);
    expect(result.body.total_count).to.equal(30);
  });

  it('tests the data returned from the List repository issues API', async () => {
    const result = await chai.request(server)
      .get('/issues/Alapan/tic-tac-toe/1/30');
    expect(result.status).to.equal(200);
    expect(result.body.length).to.equal(2);
  });

  it('lists the events for a particular issue', async () => {
    const result = await chai.request(server)
      .get('/events/Alapan/tic-tac-toe/3');
    expect(result.status).to.equal(200);
    expect(result.body.length).to.equal(2);
  });
});
