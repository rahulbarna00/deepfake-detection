import React from 'react';
import './App.css';
import Home from './components/Home';
import Footer from './components/Footer';
import Deepfake from './components/Deepfake';
import Instruction from './components/instruction';
import Navbar from './components/Navbar';
import Games from './components/Games';
import Creator from './components/creator';
function App() {
  return (
   <div className="app">
    <Navbar/>
    <Home/>
    <Instruction/>
    <Deepfake/>
    <Games/>
    <Creator/>
    <Footer/>
   </div>
  );
}

export default App;
