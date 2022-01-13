const path = require('path');
const fs = require('fs');
const solc = require('solc');

const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
const source = fs.readFileSync(lotteryPath, 'utf8');

//console.log(solc.compile(source, 1));
//OLD  module.exports = solc.compile(source, 1).contracts[':Lottery'];
//NEW ->
const input = {
    language: 'Solidity',
    sources: {
      'Lottery.sol': {
        content: source,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },
  };
   
  module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
    'Lottery.sol'
  ].Lottery;