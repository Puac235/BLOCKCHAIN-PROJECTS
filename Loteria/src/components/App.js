import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';

class App extends Component {
  render(){
    return (
    <BrowserRouter>
      <Container>
        <Header />
        <main>
          <Switch>
            <Route exact path="/" component= {Tokens} />
            <Route exact path="/loteria" component= {Loteria} />
            <Route exact path="/premios" component= {Premios} />
          </Switch>
        </main>
      </Container>
    </BrowserRouter>
    );
  }
}

export default App;
