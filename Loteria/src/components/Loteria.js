import React, { Component } from "react";
import "./App.css";
import Web3 from "web3";
import contratoLoteria from "../abis/loteria.json";
import { Icon } from "semantic-ui-react";

import loteria from "../assets/loteria.png";

class Loteria extends Component {
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
      jackpotLottery: 0,
    };
  }

  // Funcion para visualizar el Jackpot de la loteria
  jackpot = async(message) => {
    try{
        console.log(message);
        const jackpotLottery = await this.state.contract.methods.jackpot().call();
        alert(parseFloat(jackpotLottery));
        this.setState({jackpotLottery});
    }
    catch(err){
        this.setState({errMessage: err.message});
    }
    finally{
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

                <h2>Gestión y Control de Tokens de la Lotería</h2>

                <a
                  href="http://linkedin.com/in/jose-puac-gt"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <p> </p>
                  <img src={loteria} width="500" height="350" alt="" />
                  <p> </p>
                </a>

                <br/><br/>
                <h3> <Icon circular inverted color='red' name='gift'/> Lottery Jackpot</h3>
                <form onSubmit={(event) => {
                    event.preventDefault();
                    const mensaje = "Obteniendo Jackpot en Ejecución...";
                    this.jackpot(mensaje);
                }}>

                    <input type="submit"
                        className="bbtn btn-block btn-danger btn-sm"
                        value="OBTENER JACKPOT" />
                </form>
                <br/><br/>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default Loteria;
