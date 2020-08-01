import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import './styles/App.css';
import Header from './components/Header';
import HomePage from './components/HomePage';
import EditBoard from './components/EditBoard';
import SolveBoard from './components/SolveBoard';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="App">
        <Header/>
        <Switch>
          <Route path="/edit/:boardEncoding" children={<EditBoard/>}/>
          <Route path="/solve/:boardEncoding" children={<SolveBoard/>}/>
          <Route path="/"><HomePage/></Route>
        </Switch>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
