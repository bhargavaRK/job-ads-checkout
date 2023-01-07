# job-ads-checkout

## Pre Requisites

- Node JS 18.x
- TypeScript
- yarn
- vscode IDE recommended with prettier, eslint extensions

## Install & Run

- Clone reposotory
- To start the application, Run `yarn` and `yarn start`. This spins up a node server listening at http://localhost:3000

## Usage

1.  Import `postman-collection.json` in postman
2.  Run different request to see the out put

## Price Rule COnfigurations

- `src/config/pricingRules.json` contains pricing rules
- To modify any pricing rule, change above file and re-start the server.
- Current price configuraion below:
  `{
  "rules": [
    {
      "customerId": "myer",
      "products": ["standout"],
      "ruleType": "bulkbuy",
      "ruleConfig": {
        "eligibleQuantity": 5,
        "discountedQuantity": 4
      }
    },
    {
      "customerId": "myer",
      "products": ["premium"],
      "ruleType": "bulkbuy",
      "ruleConfig": {
        "eligibleQuantity": 2,
        "discountedQuantity": 1
      }
    },
    {
      "customerId": "myer",
      "products": ["premium"],
      "ruleType": "discountedPrice",
      "ruleConfig": {
        "discountedPrice": 389.99
      }
    },
    {
      "customerId": "axil-coffee-roasters",
      "products": ["standout"],
      "ruleType": "discountedPrice",
      "ruleConfig": {
        "discountedPrice": 299.99
      }
    },
    {
      "customerId": "second-bite",
      "products": ["classic"],
      "ruleType": "bulkbuy",
      "ruleConfig": {
        "eligibleQuantity": 3,
        "discountedQuantity": 2
      }
    }
  ]
}`

## Tests

- `yarn test` executes unit tests
