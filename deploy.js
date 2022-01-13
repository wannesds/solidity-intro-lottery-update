const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3 = require('web3')
const { interface, bytecode } = require('./compile')
require("dotenv").config();

//Whoever is reading this, there's no point in stealing this Eth account
//It will ONLY be used for development purposes so you'll only find fake Eth

const provider = new HDWalletProvider(
    'term meadow curious ability combine prize minimum come core dolphin timber cute',
    'https://rinkeby.infura.io/v3/de5933d8420446749237aba293c34e5e'
    // process.env.MNEMONIC,
    // process.env.INFURA_API
)
const web3 = new Web3(provider);

const deploy = async () => {
    //console.log(process.env.MNEMONIC)
    const accounts = await web3.eth.getAccounts()

    console.log('Attempting to deploy from account', accounts[1])

    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode })
        .send({ gas: '1000000', from: accounts[0] })

    console.log(interface);
    console.log('Contract deployed to', result.options.address)
    provider.engine.stop()
}
deploy();