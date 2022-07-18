// SPDX-Licence-Identifier: MIT
pragma solidity >= 0.4.4 < 0.7.0;
import "./ERC20.sol";

contract main {

    // TOKEN CONTRACT INSTANCE
    ERC20Basic private token;

    // Contract Owner
    address public owner;

    // Smart Contract Address
    address public contrato;

    // Constructor
    constructor() public {
        token = new ERC20Basic(10000);
        owner = msg.sender;
        contrato = address(this);

    }

    // Get Owner's address
    function getOwner() public view returns(address){
        return owner;
    }

    // Get Contract's address
    function getContract() public view returns(address){
        return contrato;
    }

    // Compramos tokens mediante direccion de destino y cantidad de tokens
    function sendTokens(address _destinatario, uint _numtokens) public {
        token.transfer(_destinatario, _numtokens);
    }

    // Obtenemos el balance de tokens de una direccion
    function balanceAddress(address _address) public view returns (uint){
        return token.balanceOf(_address);
    }

    // Obtenemos el balance de tokens total del smart contract
    function totalBalance() public view returns (uint){
        return token.balanceOf(contrato);
    }

}