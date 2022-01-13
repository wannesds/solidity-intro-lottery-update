const assert = require('assert') //part of node lib, to make sure that 1 value = 1 other value
const ganache = require('ganache-cli')
const Web3 = require('web3') //capital W because constructor func
const web3 = new Web3(ganache.provider()) //small w bceause instance

//const { interface, bytecode } = require('../compile')
const { abi, evm } = require('../compile');


let accounts;
let lottery;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts()

    lottery = await new web3.eth.Contract(abi)
        .deploy({ data: evm.bytecode.object })
        .send({ from: accounts[0], gas: '1000000'})
})

describe('Lottery Contract', () => {
    it('deploys a contract', () => {
        assert.ok(lottery.options.address)
    })

    it('allows one account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        })

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        })

        assert.strictEqual(accounts[0], players[0])
        assert.strictEqual(1, players.length)
    })

    it('allows multiple accounts to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        })
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02', 'ether')
        })
        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02', 'ether')
        })

        

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        })

        assert.strictEqual(accounts[0], players[0])
        assert.strictEqual(accounts[1], players[1])
        assert.strictEqual(accounts[2], players[2])

        assert.strictEqual(3, players.length)
    })

    it('requires a minimum amount of ether to enter', async () => {
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: 0
            })
            assert(false)      
        } catch (err) {
            assert(err)
        }
    })

    it('only manager can call pickWinner', async () => {
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            })
            assert(false)
        } catch (err) {
            assert(err)
        }
    })

    it('sends money to winner and resets the player array', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        })
        //some amount is payed for GAS so difference should be around 2 ether
        //thats why we put that the difference should be ABOVE 1.8 ether
        const initialBalance = await web3.eth.getBalance(accounts[0])
        await lottery.methods.pickWinner().send({ from: accounts[0] })
        const finalBalance = await web3.eth.getBalance(accounts[0])
        const difference = finalBalance - initialBalance;

        assert(difference > web3.utils.toWei('1.8', 'ether'))
    })
})