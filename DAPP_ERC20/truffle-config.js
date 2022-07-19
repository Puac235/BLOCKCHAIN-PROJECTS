require('babel-register');
require('babel-polyfill');

var HDWalletProvider = required("truffle-hdwallet-provider");
var mnemonic = "orange blue yellow " // SEED PHRASE

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(mnemonic, 'MAINNET API');
      },
      network_id: 4,
      gas: 4500000,
      gasPrice: 10000000000
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: "0.6.8",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
