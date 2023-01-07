# job-ads-checkout

- This project implements business logic for checkout total price calculations based on configurable pricing rules.
- It also creates a REST API (ex path: http://localhost:3000/checkout) to test checkout total prices with different pricing rule configurations
- A postman collection `jobads.checkout.postman_collection.json` included in the project. It has different request for different scenarios
- Product, customer, price test data is stored in `data` folder for simplicity

## Tech Stack

- Node 18.x
- TypeScript
- Jest
- yarn
- express js
- vscode IDE recommended with prettier, eslint extensions

## Install & Run

- Clone reposotory
- To start the application, Run `yarn` and `yarn start`. This spins up a node server listening at http://localhost:3000

## Usage

1.  Import `jobads.checkout.postman_collection.json` in postman
2.  Run different request to see the out put

## PricingRules Configurations

- `src/config/pricingRules.json` contains pricing rules
- To modify any pricing rule, change above file and re-start the server.

## Tests

- `yarn test` executes unit tests
