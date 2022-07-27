// SPDX-License-Identifier: MIT
pragma solidity >0.4.4 < 0.8.0;
pragma experimental ABIEncoderV2;
import "./ERC20.sol";

/// @title Lottery
/// @author puac235
/// @notice Use to make a lottery with ERC20 Tokens

contract loteria{
    
    // Instancia del contrato Token
    ERC20Basic private token;

    // Addresses
    address public owner;
    address public contractAddr;

    // # of tokens to make
    uint public createdTokens = 10000;

    // Buy tokens event
    event buyingTokens(uint, address);

    constructor() public {

        token = new ERC20Basic(createdTokens);
        owner = msg.sender;
        contractAddr = address(this);

    }

    // ------------------------------ TOKEN ------------------------------------

    // establish the token price in ethers
    function tokenPrice(uint _numTokens) internal pure returns (uint) {
        return _numTokens * (0.005 ether);
    }

    // Generate tokens
    function generateTokens(uint _numTokens) public only(msg.sender) {
        token.increaseTotalSuply(_numTokens);
    }

    // Modifier to user functions only for owner
    modifier only(address _address){
        require(_address == owner, "You are not allowed to user this function.");
        _;
    }

    // Buy tokens to buy lottery tickets
    function buyTokens(address userAddress, uint _numTokens) public payable{

        // Calculate the tokens cost
        uint cost = tokenPrice(_numTokens);
        // Require the ethers value be same or more than tokens price
        require(msg.value >= cost, "Buy less tokens or pay with more Ethers.");

        // Change of amount of money
        uint returnValue = msg.value - cost;
        // Transference of the difference
        msg.sender.transfer(returnValue);

        // Get the contract tokens balance
        uint balance = freeTokens();

        // Filter to evaluate the tonkens to buy with the free tokens
        require(_numTokens <= balance, "Buy a free amount of tokens pls.");

        // Transfer of tokens to the buyer
        token.transfer(userAddress, _numTokens);

        // Emit buyingTokens event
        emit buyingTokens(_numTokens, userAddress);

    }

    // token balance in the contract
    function freeTokens() public view returns (uint) {
        return token.balanceOf(contractAddr);
    }

    // Get the token balance in the jackpot
    function jackpot() public view returns (uint) {
        return token.balanceOf(owner);
    }

    // user's balance tokens
    function myTokens(address userAddress) public view returns (uint) {
        return token.balanceOf(userAddress);
    }

    // ------------------------------ LOTTERY ------------------------------------

    // Ticket price
    uint public ticketPrice = 15;

    // Winner 
    address public winnerAddr;

    // Relation to the user & tickets
    mapping(address => uint []) idUserTickets;
    // Relation to identify the winner
    mapping(uint => address) ticketDNA;
    // Random
    uint randNonce = 0;
    // Tickets generated
    uint [] boughtTickets;
    // Events
    event boughtTicket(uint, address);  // when a ticket is bought
    event ticketWinner(uint);           // when a ticket win
    event sellTokens(uint, address);    // when a user sell tokens

    // Buy tickets function
    function buyTicket(uint _numTickets) public {
        // total Price of tickets to buy
        uint totalPrice = _numTickets * ticketPrice;

        // Filter of tokens to pay
        require(totalPrice <= myTokens(msg.sender), "You need to buy more tokens!");
        // transfer tokens to contract's owner -> jackpot
        token.transferLotto(msg.sender, owner, totalPrice);

        /**
            Lo que esto hace es tomar la marca de tiempo actual, el msg.sender, y un nonce 
            (un numero que se utiliza una vez, para que no ejecutemos dos eces la mismoa funcion
            de hash con los mismos parametros de entrada) en incremento. 
            Luego se utiliza keccak256 para convertir las entradas a un hash aleatorio convertir
            ese hash a un uint, y seguidamente utilizamos % 10000 para tomar los 4 ultimos digitos.
            Dando un valor aleatorio entre 0 - 9999
         */

        for(uint i = 0; i < _numTickets; i++){
            uint random = uint(keccak256(abi.encodePacked(now, msg.sender, randNonce))) %  10000;
            randNonce ++;

            // Storage for the ticket data
            idUserTickets[msg.sender].push(randNonce);
            // number of te bougth ticket
            boughtTickets.push(random);
            // Assig the ticket DNA to have a winner
            ticketDNA[random] = msg.sender;
            // Event emit
            emit boughtTicket(random, msg.sender);
        }
    }

    // User's # of tickets view
    function myTickets(address userAddress) public view returns (uint[] memory) {
        return idUserTickets[userAddress];
    }

    // TAKE A JACKPOT WINNER!
    function generateWinner() public only(msg.sender) {
        // Debe haber boletos comprados para generar un ganador
        require(boughtTickets.length > 0, "There's any tickets bought!");
        // Array's length variable
        uint lengthArr = boughtTickets.length;
        // Choose a number between 0 to lenghtArr randomly
        // election of a random position of the array
        uint positionArr = uint(uint(keccak256(abi.encodePacked(now))) % lengthArr);
        // Selection of the random number according with the position of the array
        uint election = boughtTickets[positionArr];
        // Emit of the winner's event
        emit ticketWinner(election);

        // get the winner address
        winnerAddr =  ticketDNA[election];
        // send the jackpot to the winner
        token.transferLotto(msg.sender, winnerAddr, jackpot());
    }

    // tokens devolution to ethers
    function devolverTokens(uint _numTokens) public payable {
        // tokens number to sell
        require(_numTokens > 0, "You must sell more than 0 tokens.");
        // The user must have the tokens want to sell
        require(_numTokens <= myTokens(msg.sender), "You don't have enought tokens to sell.");
        // User sell the tokens
        // 1. the user return the tokens
        // 2. The lottery pay for the returned tokens in ethers
        token.transferLotto(msg.sender, address(this), _numTokens);
        msg.sender.transfer(tokenPrice(_numTokens));
        // sell event emit
        emit sellTokens(_numTokens, msg.sender);
    }

}

