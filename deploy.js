const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { abi, evm } = require('./compile');


//Whoever is reading this, there's no point in stealing this Eth account
//It will ONLY be used for development purposes so you'll only find fake Eth

const provider = new HDWalletProvider(
    // process.env.MNEMONIC,
    // process.env.INFURA_API
)
const web3 = new Web3(provider);

const deploy = async () => {
    //console.log(process.env.MNEMONIC)
    const accounts = await web3.eth.getAccounts()

    console.log('Attempting to deploy from account', accounts[1])

    const result = await new web3.eth.Contract(abi)
        .deploy({ data: evm.bytecode.object })
        .send({ gas: '1000000', from: accounts[0] })

        console.log(JSON.stringify(abi));
        console.log('Contract deployed to', result.options.address);
        provider.engine.stop();
}
deploy();
