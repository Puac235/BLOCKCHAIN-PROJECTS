import React, { Component } from "react";
import "./App.css";
import Web3 from "web3";
import contratoLoteria from "../abis/loteria.json";
import { Icon } from "semantic-ui-react";

import tokens from "../assets/tokens.png";

class Tokens extends Component {
  async componentWillMount() {
    // 1. Carga de Web3
    await this.loadWeb3();
    // 2. Carga de datos de la  Blockchain
    await this.loadBlockchainData();
  }

  // 1. Carga de Web3
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "There's no one browser detected. You should consider to use Metamask!"
      );
    }
  }

  // 2. Carga de datos de la Blockchain
  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    console.log("Account: ", this.state.account);

    const networkID = "5777"; // Ganache -> 5777, Rinkeby -> 4, BSC -> 97
    console.log("network ID: ", networkID);

    const networkData = contratoLoteria.networks[networkID];
    console.log("network Data: ", networkData);

    if (networkData) {
      const abi = contratoLoteria.abi;
      console.log("abi: ", abi);
      const address = networkData.address;
      console.log("address: ", address);
      const contract = new web3.eth.Contract(abi, address);
      this.setState({ contract });
    } else {
      window.alert("The Smart Contract is noy deployed on web!");
    }
  }

  // Constructor
  constructor(props) {
    super(props);
    this.state = {
      contract: null,
      loading: false,
      errMessage: "",
      account: "",
      compradorTokens: "",
      cantidad: 0,
      balanceAddress: "",
      balanceContract: "",
      numTokens: 0
    };
  }

  // Funcion para realizar la compra de tokens
  send = async (userAddress, numTokens, ehters, message) => {
    try {
      console.log(message);
      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      await this.state.contract.methods
        .buyTokens(userAddress, numTokens)
        .send({ from: accounts[0], value: ehters });
    } catch (err) {
      this.setState({ errMessage: err.message });
    } finally {
      this.setState({ loading: false });
    }
  };

  // Funcion para obtener el balance de tokens de una persona
  getBalanceUser = async (userAddress, message) => {
    try {
      console.log(message);
      const balanceAddress = await this.state.contract.methods.myTokens(userAddress).call();
      this.setState({balanceAddress});
      alert(parseFloat(balanceAddress));
    } catch (err) {
      this.setState({ errMessage: err.message });
    } finally {
      this.setState({ loading: false });
    }
  };

  // Funcion para obtener el balance de tokens del smart contract disponible
  getBalanceContract = async (message) => {
    try {
      console.log(message);
      const balanceContract = await this.state.contract.methods.freeTokens().call();
      this.setState({balanceContract});
      alert(parseFloat(balanceContract));
    } catch (err) {
      this.setState({ errMessage: err.message });
    } finally {
      this.setState({ loading: false });
    }
  };

  // Funcion para incrementar los tokens en el Smart Contract
  increaseTokens = async (numTokens, message) => {
    try {
      console.log(message);
      const web3 = window.web3;
      const accounts =  await web3.eth.getAccounts();
      await this.state.contract.methods.generateTokens(numTokens).send({from:accounts[0]});
      alert("Incremento de Tokens Realizado Correctamente!");
    } catch (err) {
      this.setState({ errMessage: err.message });
    } finally {
      this.setState({ loading: false });
    }
  };

  // Render de la DApp
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
            ERC20 LOTTERY
          </a>
          <ul className="navbar-nav px=3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                <small className="text-white"><span id="account">Cuenta Activa: {this.state.account}</span></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>ERC20 Lottery!</h1>

                <h2>Gestión y Control de Tokens de la Lotería</h2>

                <a href="http://linkedin.com/in/jose-puac-gt"
                    target="_blank"
                    rel="noopener noreferrer">
                        <p> </p>
                        <img src={tokens} width="450" height="400" alt=""/>
                        <p> </p>
                </a>
                <h3> <Icon circular inverted color='red' name='dollar'/> Compra Tokens ERC-20</h3>
                <form onSubmit={(event) => {
                    event.preventDefault();
                    const compradorTokens = this.compradorTokens.value;
                    const cantidad = this.cantidad.value;
                    const web3 = window.web3;
                    const ethers = web3.utils.toWei(this.cantidad, value, 'ether');
                    const mensaje = "Compra de Tokens ERC-20 en ejecucion...";
                    this.send(compradorTokens, cantidad, ethers, mensaje);
                }}>
                    <input type="text" 
                        className="form-control mb-1" 
                        placeholder="Direccion de Envio de los Tokens"
                        ref={(input) => this.compradorTokens = input} />

                    <input type="text" 
                        className="form-control mb-1" 
                        placeholder="Cantidad de Tokens a Comprar"
                        ref={(input) => this.cantidad = input} />

                    <input type="submit"
                        className="bbtn btn-block btn-danger btn-sm"
                        value="COMPRAR TOKENS ERC20" />
                </form>
                <br/><br/>
                <h3> <Icon circular inverted color='blue' name='bitcoin'/> Balance de Tokens ERC-20 de un Usuario</h3>
                <form onSubmit={(event) => {
                    event.preventDefault();
                    const userAddress = this.userAddress.value;
                    const mensaje = "Obtención de Balance en Ejecución...";
                    this.getBalanceUser(userAddress, mensaje);
                }}>
                    <input type="text" 
                        className="form-control mb-1" 
                        placeholder="Direccion de la cuenta del usuario"
                        ref={(input) => this.userAddress = input} />

                    <input type="submit"
                        className="bbtn btn-block btn-primary btn-sm"
                        value="OBTENER BALANCE DE TOKENS ERC-20" />
                </form>
                <br/><br/>
                <h4>{this.state.balanceAddress!=''? "BALANCE DE LA CUENTA: " + this.state.balanceAddress: ""}</h4>

                <br/><br/>
                <h3> <Icon circular inverted color='orange' name='bitcoin'/> Balance de Tokens ERC-20 del Smart Contract</h3>
                <form onSubmit={(event) => {
                    event.preventDefault();
                    const mensaje = "Obtención de Balance del Contrato en Ejecución...";
                    this.getBalanceContract(mensaje);
                }}>

                    <input type="submit"
                        className="bbtn btn-block btn-warning btn-sm"
                        value="OBTENER BALANCE DE TOKENS ERC-20 DEL SMART CONTRACT" />
                </form>
                <br/><br/>
                <h4>{this.state.balanceContract!=''? "BALANCE DEL SMART CONTRACT: " + this.state.balanceContract: ""}</h4>
                <br/><br/>
                <h3> <Icon circular inverted color='green' name='plus'/> Incrementar Tokens del Smart Contract</h3>
                <form onSubmit={(event) => {
                    event.preventDefault();
                    const numTokens = this.numTokens.value;
                    const mensaje = "Incremento de Tokens en Ejecución...";
                    this.increaseTokens(numTokens, mensaje);
                }}>
                    <input type="text" 
                        className="form-control mb-1" 
                        placeholder="Número de Tokens a Incrementar"
                        ref={(input) => this.numTokens = input} />

                    <input type="submit"
                        className="bbtn btn-block btn-success btn-sm"
                        value="INCREMENTAR TOKENS DEL SMART CONTRACT" />
                </form>
                <br/><br/>



                <br/><br/>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default Tokens;
