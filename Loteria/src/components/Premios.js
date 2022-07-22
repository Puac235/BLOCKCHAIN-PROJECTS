import React, {Component} from 'react';
import './App.css';
import Web3 from 'web3';
import contratoLoteria from '../abis/loteria.json';
import { Icon } from 'semantic-ui-react';

import winner from '../assets/winner.png';

class Premios extends Component {
    async componentWillMount(){
        // 1. Carga de Web3
        await this.loadWeb3();
        // 2. Carga de datos de la  Blockchain
        await this.loadBlockchainData();
    }

    // 1. Carga de Web3
    async loadWeb3(){
        if(window.ethereum){
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        }
        else if(window.web3){
            window.web3 = new Web3(window.web3.currentProvider);
        }
        else{
            window.alert("There's no one browser detected. You should consider to use Metamask!");
        }
    }

    // 2. Carga de datos de la Blockchain
    async loadBlockchainData(){
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        this.setState({account: accounts[0]});
        console.log('Account: ', this.state.account);
        
        const networkID = '5777'; // Ganache -> 5777, Rinkeby -> 4, BSC -> 97
        console.log('network ID: ', networkID);
        
        const networkData = contratoLoteria.networks[networkID];
        console.log('network Data: ', networkData);

        if(networkData){
            const abi = contratoLoteria.abi;
            console.log('abi: ', abi);
            const address = networkData.address;
            console.log('address: ', address);
            const contract = new web3.eth.Contract(abi, address);
            this.setState({contract});
        }
        else{
            window.alert('The Smart Contract is noy deployed on web!');
        }
    }

    // Constructor
    constructor(props){
        super(props);
        this.state = {
            contract: null,
            loading: false,
            errMessage: "",
            account: "",
        };
    }

    // Render de la DApp
    render () {
        return (
            <p>PREMIOS</p>
        );
    }
}

export default Premios;