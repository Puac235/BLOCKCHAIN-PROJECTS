import React, { Component } from "react";
import "./App.css";
import Web3 from "web3";
import Color from "../abis/Color.json";

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("Considera descargarte Metamask! D:");
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    // Load account
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    // const networkId = await web3.eth.net.getId();
    const networkId = "5777";
    const networkData = Color.networks[networkId];
    if (networkData) {
      const abi = Color.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi, address);
      this.setState({ contract });
      // SMART CONTRACT TOTAL SUPPLY FUNCTION
      const totalSupply = await contract.methods.totalSupply().call();
      this.setState({ totalSupply });
      // Color Charge
      for (var i = 1; i <= totalSupply; i++) {
        const color = await contract.methods.colors(i - 1).call();
        this.setState({ colors: [...this.state.colors, color] });
      }
    } else {
      window.alert("Smart Contract no desplegado en la red.");
    }
  }

  // CONTRUCTOR
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      contract: null,
      totalSupply: 0,
      colors: [],
    };
  }

  // New NFT color Function
  mint = (color) => {
    this.state.contract.methods
      .mint(color)
      .send({ from: this.state.account })
      .once("receipt", (receipt) => {
        this.setState({ colors: [...this.state.colors, color] });
      });
  };

  render() {
    return (
      <div className="bg-dark shadow">
        <nav className="navbar fixed-top flex-md-nowrap p-0">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            target="_blank"
            rel="noopener noreferrer"
          >
            Colors NFTs
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item next-nowrap d-none d-sm-none d-sm-block">
              <small className="text-black">
                <span id="account"> {this.state.account} </span>
              </small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                

                <h1 className="text-white">DApp Colors NFTs</h1>
                <form onSubmit={(event) => {
                  event.preventDefault();
                  const color = '#' + this.color.value;
                  this.mint(color);
                }}>
                  <input
                    type='text'
                    className="form-control mb-1"
                    placeholder="Ej: #FFFFFF"
                    ref={(input) => {this.color = input}}
                    />
                    <input
                      type='submit'
                      className="btn btn-block btn-primary"
                      value="MINT NEW NFT"
                      />
                </form>
              </div>
            </main>
          </div>
          <hr/>
          <div className="row text-center">
            { this.state.colors.map((color, key) => {
              return (
                <div key={key} className="col-md-3 mb-3">
                  <div className="token"
                      style={{backgroundColor: color}}
                  />  
                  <div className="text-white">{color}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
