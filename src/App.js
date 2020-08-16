import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import './styles/App.css';
import Header from './components/Header';
import HomePage from './components/HomePage';
import EditBoardWrapper from './components/EditBoardWrapper';
import SolveBoardWrapper from './components/SolveBoardWrapper';
import SolveBoard from './components/SolveBoard';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="App">
        <Header/>
        <Switch>
          <Route path="/edit/:boardEncoding" children={<EditBoardWrapper/>}/>
          <Route path="/solve/:boardEncoding" children={<SolveBoardWrapper/>}/>
          <Route path="/"><HomePage/></Route>
        </Switch>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
