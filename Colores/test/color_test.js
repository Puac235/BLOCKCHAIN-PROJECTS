const Color = artifacts.require('./Color.sol');

require('chai').use(require('chai-as-promised')).should();

contract('Color', (accounts) =>{
    let contract;

    before(async () => {
        contract = await Color.deployed();
    });

    describe('deployment', async() => {
        it('Despliegue exitoso', async() =>{
            const address = contract.address;
            assert.notEqual(address, 0x0);
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        });
        it('Tiene un nombre', async() => {
            const name = await contract.name();
            assert.equal(name, 'Color');
        });
        it('Tiene un simbolo', async() => {
            const symbol = contract.symbol()
            assert.equal(symbol, 'COLOR');
        });
    });

    describe('minting', async() => {
        it('creacion de un nuevo token', async() => {
            const result = await contract.mint('#EC058E');
            const totalSupply = await contract.totalSupply();
            // Exitoso
            assert.equal(totalSupply, 1);
            const event = result.logs[0].args;
            assert.equal(event.tokenId.toNumber(), 1, 'Correct ID');
            assert.equal(event.from, '0x0000000000000000000000000000', 'Correct Address');
            assert.equal(event.to, accounts[0], 'Correct Address');
            // No exitoso
            await contract.mint('#EC058E').should.be.rejected;
        });
    });

    describe('indexing', async() => {
        it('Lista de Colores', async() => {
            await contract.mint('#5386E4');
            await contract.mint('#FFFFFF');
            await contract.mint('#000000');

            const totalSupply = contract.totalSupply();
            
            let color;
            let result = [];

            for(var i = 1; i <= totalSupply; i++){
                color = await contract.colors(i-1);
                result.push(color);
            }

            let expected = ['#5386E4', '#FFFFFF', '#000000'];
            assert.equaL(result.join(',').expected.join(','));


        });
    });
});