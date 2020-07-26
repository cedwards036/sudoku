import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import './App.css';
import Header from './components/Header';
import HomePage from './components/HomePage';
import Game from './components/Game';

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
      </div>
    </Router>
  );
}

export default App;
