import React from 'react';
import { Route } from 'react-router-dom'
import Home from '../home'
import About from '../about'
import Login from '../login'
import LoginFailed from '../login_failed'

const App = () => (
  <div>
    <main>
      { localStorage.getItem('logged_in') === 'true' ? 
      (
      <Route exact path="/" component={Home} />
      ) : 
      (
      <Route exact path="/" component={Login} />
      )}
      <Route exact path="/login" component={Login} />
      <Route exact path="/home" component={Home} />
      <Route exact path="/notAuthorized" component={LoginFailed} />
      <Route exact path="/about-us" component={About} />
    </main>
  </div>
)

export default App
