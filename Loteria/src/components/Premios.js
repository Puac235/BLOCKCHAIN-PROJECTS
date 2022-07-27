import React, { Component } from "react";
import "./App.css";
import Web3 from "web3";
import contratoLoteria from "../abis/loteria.json";
import { Icon } from "semantic-ui-react";

import winner from "../assets/winner.png";

class Premios extends Component {
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
      winnerAddr: "",
    };
  }

  // Funcion para establecer un ganador
  winner = async (message) => {
    try {
        console.log(message);
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        await this.state.contract.methods.generateWinner().send({from: accounts[0]});
        alert('GANADOR SELECCIONADO!! 🏆🏆🏆');
    } catch (error) {
        this.setState({errMessage: error.message});
    } finally {
        this.setState({loading: false});
    }
  }

  // Funcion para visualizar la direccion del ganador
  getWinner = async (message) => {
    try {
        console.log(message);
        const winnerAddr = await this.state.contract.methods.winnerAddr().call();
        this.setState({winnerAddr});
    } catch (error) {
        this.setState({errMessage: error.message});
    } finally {
        this.setState({loading: false});
    }
  }

  // Funcion para devolver sus tokens a ethers
  returnTokens = async (numTokens, message) => {
    try {
        console.log(message);
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        await this.state.contract.methods.devolverTokens(numTokens).send({from: accounts[0]});
        alert('TRANSACCION REALIZADA EXITOSAMENTE');
    } catch (error) {
        this.setState({errMessage: error.message});
    } finally {
        this.setState({loading: false});
    }
  }

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
              <small className="text-white">
                <span id="account">Cuenta Activa: {this.state.account}</span>
              </small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>ERC20 Lottery!</h1>

                <h2>Ganador de la Loteria</h2>

                <a
                  href="http://linkedin.com/in/jose-puac-gt"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <p> </p>
                  <img src={winner} width="450" height="400" alt="" />
                  <p> </p>
                </a>
                <h3>
                  {" "}
                  <Icon circular inverted color="blue" name="winner" /> Lottery
                  Winner
                </h3>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    const mensaje = "Obteniendo Winner en Ejecución...";
                    this.winner(mensaje);
                  }}
                >
                  <input
                    type="submit"
                    className="bbtn btn-block btn-primary btn-sm"
                    value="GENERATE WINNER"
                  />
                </form>
                <br />
                <br />
                <h3>
                  {" "}
                  <Icon circular inverted color="yellow" name="user" /> WINNER ADDRESS
                </h3>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    const mensaje = "Obteniendo Winner Address en Ejecución...";
                    this.getWinner(mensaje);
                  }}
                >
                  <input
                    type="submit"
                    className="bbtn btn-block btn-warning btn-sm"
                    value="GET WINNER ADDRESS"
                  />
                </form>
                <h4>
                  {this.state.winnerAddr != ""
                    ? "WINNER ADDRESS: " + this.state.winnerAddr
                    : ""}
                </h4>
                <br />
                <br />
                <h3>
                  {" "}
                  <Icon circular inverted color="red" name="ethereum" />{" "}
                  Vender Tokens
                </h3>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    const numTickets = this.numTickets.value;
                    const mensaje = "Venta de tokens en Ejecución...";
                    this.returnTokens(numTickets, mensaje);
                  }}
                >
                  <input
                    type="text"
                    className="form-control mb-1"
                    placeholder="Numero de Tokens a Vender"
                    ref={(input) => (this.numTickets = input)}
                  />

                  <input
                    type="submit"
                    className="bbtn btn-block btn-danger btn-sm"
                    value="VENDER TOKENS"
                  />
                </form>
                <br />
                <br />
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default Premios;
