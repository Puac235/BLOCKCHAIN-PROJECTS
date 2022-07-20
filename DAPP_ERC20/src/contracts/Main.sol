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
    constructor () public {
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

    // Get price token
    function priceTokens(uint _numTokens) internal pure returns (uint) {
        // Conversion tokens to Ethers: 1 token -> 1 ether
        return _numTokens * (0.1 ether);
    }

    // Compramos tokens mediante direccion de destino y cantidad de tokens
    function sendTokens(address _destinatario, uint _numTokens) public payable {
        require(_numTokens < 10, "La cantidad de tokens es demasiado alta.");

        // get tokens price
        uint cost =  priceTokens(_numTokens);
        // Evaluate the price in ethers to pay
        require(msg.value >= cost, "Compra menos tokens o paga con más ethers!");
        // User's change
        uint returnValue = msg.value - cost;
        // return ethers change to user
        msg.sender.transfer(returnValue);

        // get balance of tokens free
        uint balance = totalBalance();

        require(_numTokens <= balance, "Compra un numero menor de tokens, tokens insuficientes");

        // Transferencia de los tokens al destinatario
        token.transfer(_destinatario, _numTokens);
    }

    // Generacion de tokens al contrato
    function generateTokens(uint _numTokens) public onlybyOwner(){
        token.increaseTotalSuply(_numTokens);
    }

    // Modificador que permita la ejecucion tan solo por el owner
    modifier onlybyOwner(){
        require(msg.sender == owner, "No tienes permisos para esta funcion.");
        _;
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