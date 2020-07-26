import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import './styles/App.css';
import Header from './components/Header';
import HomePage from './components/HomePage';
import Game from './components/Game';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="App">
        <Header/>
        <Switch>
          <Route path="/enter-puzzle">
            <Game/>
          </Route>
          <Route path="/solve/:id" children={<Game/>}/>
          <Route path="/">
            <HomePage/>
          </Route>
        </Switch>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
