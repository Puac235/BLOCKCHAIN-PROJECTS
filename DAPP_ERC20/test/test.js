// Llamada al contrato 'Main'

const main = artifacts.require('Main');

contract('Main', accounts => {
    it('Function: getOwner()', async () => {
        // Smart Contract deployed
        let instance = await main.deployed();
        

        const direccionOwner = await instance.getOwner.call();

        console.log('Accounts[0]: ', accounts[0]);
        console.log('Direccion del Owner: ', direccionOwner);
        assert.equal(accounts[0], direccionOwner);
    });

    it('Function: sendTokens(address _destinatario, uint _numTokens)', async () => {
        // Smart Contract deployed
        let instance = await main.deployed();

        initialBalanceAddress = await instance.balanceAddress.call(accounts[0]);
        initialBalanceContract = await instance.totalBalance.call();
        console.log("Balance de accounts[0]", initialBalanceAddress);
        console.log("Balance total del contrato", initialBalanceContract);

        // Send Tokens
        await instance.sendTokens(accounts[0],5, {from: accounts[0]});

        // Balance update after transaction
        balanceAddress = await instance.balanceAddress.call(accounts[0]);
        balanceContract = await instance.totalBalance.call();
        console.log("Balance de accounts[0]", balanceAddress);
        console.log("Balance total del contrato", balanceContract);

        // Verificaciones

        assert.equal(balanceAddress, parseInt(initialBalanceAddress) + 5);
        assert.equal(balanceContract, parseInt(initialBalanceContract) - 5);

    });
});