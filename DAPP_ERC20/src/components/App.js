import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3';
import web3 from '../ethereum/web3';
import contractToken from '../abis/main.json';


class App extends Component {

  async componentWillMount(){
    
    // Carga de la web3
    await this.loadWeb3();

    // Carga de los datos de la blockchain
    await this.loadBlockchainData();

  }

  // Carga de web3
  async loadWeb3(){
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    else if(window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else{
      window.alert('Non-Ethereum browser detected. You should consider to try Metamask!');
    }
  }

  // Carga de la data de la Blockchain
  async loadBlockchainData(){
    const web3 = window.web3;
    // Carga de la cuenta
    const accounts = await web3.eth.getAccounts();
    this.setState({account: accounts[0]});

    const networkId = '5777';
    console.log('networkID: ', networkId);

    const networkData = contractToken.networks[networkId];
    console.log('networkData: ', networkData);

    if(networkData){

      const abi = contractToken.abi;
      console.log('abi: ', abi);
      const address = networkData.address;
      console.log('address: ', address);

      const contract = new web3.eth.Contract(abi, address);
      this.setState({contract});

      // TODO: DIRECCION DEL CONTRATO


    }
    else{
      alert('El Smart Contract no se ha desplegado en la red!');
    }

  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="https://frogames.es/rutas-de-aprendizaje"
            target="_blank"
            rel="noopener noreferrer"
          >
            Token ERC20 (PuaCoin) DApp
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="https://frogames.es/rutas-de-aprendizaje"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={logo} className="App-logo" alt="logo" />
                </a>
                <h1>DApp</h1>
                <p>
                  Edita <code>src/components/App.js</code> y guarda para recargar.
                </p>
                <a
                  className="App-link"
                  href="https://frogames.es/rutas-de-aprendizaje"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                   APRENDE BLOCKCHAIN <u><b>AHORA! </b></u>
                </a>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
