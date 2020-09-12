const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const nock = require('nock');
const server = require('./app');

chai.use(chaiHttp);

describe('test Issues APIs', (done) => {

  before(() => {
    nock('https://api.github.com')
      .get('/repos/Alapan/tic-tac-toe/issues')
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

    nock('https://api.github.com')
      .get('/repos/Alapan/tic-tac-toe/issues/events/3417931151')
      .reply(200, {
        id: 3417931151,
        url:'https://api.github.com/repos/Alapan/tic-tac-toe/issues/events/3417931151'
      });
  });

  after(() => {
    nock.cleanAll();
  });

  it('tests the data returned from the List repository issues API', async () => {
    const result = await chai.request(server)
      .get('/issues/Alapan/tic-tac-toe');
    expect(result.status).to.equal(200);
    expect(result.body.length).to.equal(2);
  });

  it('lists the events for a particular issue', async () => {
    const result = await chai.request(server)
      .get('/issues/Alapan/tic-tac-toe/3/events');
    expect(result.status).to.equal(200);
    expect(result.body.length).to.equal(2);
  });

  it('tests details of a particular event', async() => {
    const result = await chai.request(server)
      .get('/issues/Alapan/tic-tac-toe/events/3417931151');
    expect(result.status).to.equal(200);
    expect(result.body.id).to.equal(3417931151);
  });
});
