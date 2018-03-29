
An example Ethereum API built with Node, Express and MongoDB. Also includes a small testing suite. 

Command | Task
------------ | -------------
`npm run dev`| Runs API with nodemon 
`npm test` | Runs unit/API testing suite 
`npm start` | Runs API without nodemon

## Installation

1. `npm install`
2. `npm run dev` (nodemon) or `npm start` (node)
3. Navigate to `localhost:3000`


## API Routes

#### Get /accounts/:account/initialize
Request accounts & txs from Etherscan API and store in Mongo

Response: 
```
{message: 'Account stored'} || {message: 'Account already stored'}

```

#### Get /accounts/:account/
Request general account info 

Response: 
```
data: [
{
transactions: [
"5abd09a13605aa380fc81ede",
"5abd09a13605aa380fc81edf",
"5abd09a13605aa380fc81ee0",
...
],
_id: "5abd09a13605aa380fc81f30",
address: "0x3b1349d837fa08070694d329146a6a99a4bdd924",
balance: 2533504046896761000,
__v: 0
}
]
}
```

#### GET /accounts/:account/transactions
Request txs info for a given account

Query variables: 
* All variables in the document (id, blockNumber, from, to , value, gas, etc.)
* minBlock (returns txs that occurred after a given block)
* maxBlock (returns txs that occurred before a given block)

Response: 
```
data: [
{
_id: "5abcfbee344b502cef61034e",
blockNumber: 3733065,
hash: "0x973164af7b11f53c0ba79486f9c8e81b9373e5edbbb7dd3b415d40f85d10b645",
nonce: 0,
blockHash: "0x4f41baf0ec6ca2882c5ca8887d1a5274a3ca95a46e3eac8db375e448a73eb71b",
transactionIndex: 59,
from: "0x8b818d511826b0c63aa5ddc8f44c2c358a1cdae4",
to: "0x3b1349d837fa08070694d329146a6a99a4bdd924",
value: 2000000000000000000,
gas: 90000,
gasPrice: "20082189118",
isError: false,
input: "0x",
cumulativeGasUsed: "2722566",
gasUsed: 21000,
confirmations: 1610446,
__v: 0
},
...
]
```