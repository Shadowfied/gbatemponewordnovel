# GBAtemp One Word Novel Reader

**Live site: https://gbatemponewordnovel.herokuapp.com/**

This is a reader for [GBAtemps One Word Novel thread](https://gbatemp.net/threads/lets-write-a-novel-one-word-at-time.575304/).

The project runs Expressjs to serve the API and static files. The frontend is written in React.

## Development

Clone the repo and run `npm install` in both the root dir and frontend dir. Run `npm run build` followed by `npm run start` to build the database, build the static assets and serve them.

When working on the frontend, run `npm run start` from the frontend directory. The frontend development environment is proxied to the Express app, so any fetch requests will be picked up by Express so you can stil use hot reloading and all other goodies from the React development environment.

## Contributing

This repo follows [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
