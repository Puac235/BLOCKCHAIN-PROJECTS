import React from 'react';
import { Menu, Button, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export default() => {
    return(
        <Menu stackable style={{marginTop: '50px'}}>

            <Button color='blue' as={Link} to='/' >
                ERC20 Tokens Manage
            </Button>
            <Button color='green' as={Link} to='/loteria' >
                Tickets Manage
            </Button>
            <Button color='orange' as={Link} to='/premios' >
                Jackpot
            </Button>
            <Button color='linkedin' href="http://www.linkedin.com/in/jose-puac-gt" >
                <Icon name='linkedin' /> LinkedIn
            </Button>
        </Menu>


    );
}