const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledMedicine = require('./build/Medicine.json');

const provider = new HDWalletProvider(
'arm segment august fence disagree adapt doll deny rely setup mango ability',
'https://ropsten.infura.io/v3/7bd57429d5574d5a89402d232473b893'
);
const web3 = new Web3(provider);

const deploy = async () => {
const accounts = await web3.eth.getAccounts();

console.log('Attempting to deploy from account', accounts[1]);

const result = await new web3.eth.Contract(
JSON.parse(compiledFactory.interface)
)
.deploy({ data: compiledFactory.bytecode })
.send({ gas: '5500000', from: accounts[0] });

console.log('Contract deployed to', result.options.address);
};
deploy();