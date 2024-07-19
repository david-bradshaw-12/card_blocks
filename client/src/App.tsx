import React from 'react'

import logoRise360 from './logo-rise-360.svg'
import logoRiseCom from './logo-rise-com.svg'
import LearningBlock from './block'
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logoRiseCom} className="App-logo" alt="logo" />
        <h1>Rise Tech Challenge</h1>
        <img src={logoRise360} className="App-logo" alt="logo" />
      </header>
      <section className="App-section">
        <h2>
        <span className="App-code">
          {"Knowledge Check Block"}
        </span>
        </h2>
        <LearningBlock />
      </section>
    </div>
  )
}

export default App
