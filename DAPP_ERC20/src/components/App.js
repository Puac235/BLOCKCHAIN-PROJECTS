import React, { Component } from 'react';
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

    // const networkId = '5777';  // Ganache
    const networkId = '4';        // Rinkeby

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
      const smartContractAddress = await this.state.contract.methods.getContract().call();
      this.setState({smartContractAddress});
      console.log("Direccion del Smart Contract ", smartContractAddress);

    } 
    else{
      alert('El Smart Contract no se ha desplegado en la red!');
    }

  }

  // Funcion para realizar la compra de tokens
  envio = async(direccion, cantidad, ethers, mensaje) => {
    try{
      console.log(mensaje);
      const accounts = await web3.eth.getAccounts();
      await this.state.contract.methods.sendTokens(direccion, cantidad).send({from: accounts[0], value: ethers});
    }
    catch(error){
      this.setState({ errorMessage: error.message });
    }
    finally {
      this.setState({ loading: false });
    }
  }

  //Funcion para visualizar el balance de tokens de un usuario
  balanceUser = async(addressBalance, message) => {
    try{
      console.log(message);
      //Balance del usuario
      const balanceAddress = await this.state.contract.methods.balanceAddress(addressBalance).call();
      alert(balanceAddress);
      this.setState({addressBalance: balanceAddress});
    }
    catch(error){
      this.setState({ errorMessage: error.message });
    }
    finally {
      this.setState({ loading: false });
    }
  }

  //Funcion para visualizar el balance de tokens del contrato
  balanceContract = async(message) => {
    try{
      console.log(message);
      //Balance del usuario
      const balanceContract = await this.state.contract.methods.totalBalance().call();
      alert(parseFloat(balanceContract));
      this.setState({contractBalance: balanceContract});
    }
    catch(error){
      this.setState({ errorMessage: error.message });
    }
    finally {
      this.setState({ loading: false });
    }
  }

  //Funcion para incrementar el balance de tokens del smart contract
  incrementTokens = async(numTokens, message) => {
    try{
      console.log(message);
      //Incrementar el balance de tokens del smart contract
      await this.state.contract.methods.generateTokens(numTokens).send({account: accounts[0]});
    }
    catch(error){
      this.setState({ errorMessage: error.message });
    }
    finally {
      this.setState({ loading: false });
    }
  }

  constructor(props){
    super(props);
    this.state = {
      cantidad: 0,
      account: '',
      contract: null,
      smartContractAddress: '',
      owner: '',
      address: '',
      loading: false,
      errorMessage: '',
      addressBalance: '',
      contractBalance: ''
    };
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
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white">
                <span id="account">{this.state.smartContractAddress}</span>
              </small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Comprar PuaCoins ERC20</h1>
                <form onSubmit={(event) => {
                  event.preventDefault();
                  const direccion = this.direccion.value;
                  const cantidad = this.cantidad.value;
                  const ethers = web3.utils.toWei(this.cantidad.value, 'ether');
                  const mensaje = "Compra de tokens en ejecucion...";
                  this.envio(direccion, cantidad, ethers, mensaje);

                }}>
                  <input type='text' 
                    className='form-control mb-1' 
                    placeholder='Direccion de destino'
                    ref={(input) => {this.direccion = input;}} />
                  <input type='text' 
                    className='form-control mb-1' 
                    placeholder='Cantidad de PuaCoins a enviar' 
                    ref={(input) => {this.cantidad = input;}} />  
                  <input type='submit'
                    className='btn btn-block btn-primary btn-sm'
                    value='COMPRAR PUACOINS'/>
                </form>

                &nbsp;

                <h1>Balance total de Tokens del Usuario</h1>
                <form onSubmit={(event) => {
                  event.preventDefault();
                  const address = this.addressBalance.value;
                  const mensaje = "Balance de tokens de un usuario en ejecucion...";
                  this.balanceUser(address, mensaje);

                }}>
                  <input type='text' 
                    className='form-control mb-1' 
                    placeholder='Direccion del usuario'
                    ref={(input) => {this.addressBalance = input;}} />
                  <input type='submit'
                    className='btn btn-block btn-danger btn-sm'
                    value='OBTENER BALANCE DE TOKENS'/>
                </form>
                
                &nbsp;
                
                <h1>Balance total de Tokens del Contrato</h1>
                <form onSubmit={(event) => {
                  event.preventDefault();
                  const mensaje = "Balance de tokens del contrato en ejecucion...";
                  this.balanceContract(mensaje);
                }}>
                  <input type='submit'
                    className='btn btn-block btn-success btn-sm'
                    value='OBTENER BALANCE DE TOKENS DE CONTRATO'/>
                </form>

                &nbsp;
                
                <h1>Añadir Nuevos Tokens</h1>
                <form onSubmit={(event) => {
                  event.preventDefault();
                  const numTokens = this.numTokens.value;
                  const mensaje = "Incremento tokens del Smart Contract en ejecucion...";
                  this.incrementTokens(numTokens, mensaje);

                }}>
                  <input type='text' 
                    className='form-control mb-1' 
                    placeholder='Número de tokens a incrementar'
                    ref={(input) => {this.numTokens = input;}} />
                  <input type='submit'
                    className='btn btn-block btn-warning btn-sm'
                    value='INCREMENTAR TOKENS'/>
                </form>

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
