The NodeJS/Express application fetches details about issues from the Github API. API endpoints written in Express can be called to return data such as list of issues in a repository and an issue's associated events.


## Installation

In a local terminal, run the following steps:

1) `git clone git@github.com:Alapan/Github_Issues_Backend.git`
2) cd into the project root, and run `npm install`
3) In the same location, run `npm start` to start a local server in ([http://localhost:8000](http://localhost:8000))

## Prerequisites

Calling the Github API requires the user to have a personal access token from Github. I saved the access token as an environment variable using the dotenv package while doing the project. A sample .env file has been provided in the public repository (.SAMPLE_env), showing the format of the expected data. When running the application, a real file called .env will have to be created in the project root having an actual personal access token from Github (instructions - https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token).

## Available Scripts

To run tests:

### `npm test`

To lint code:

### `npm run lint`


## Libraries and tools used

- Express 4.16.1
- Node
- Octokit to call the Github APIs
- Mocha
- ESLint
