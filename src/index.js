import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import rootReducer from './reducers'
import App from './App'

// Load coin data from previous page load if it exists
const persistedState = localStorage.getItem('coincount_app_state') ? JSON.parse(localStorage.getItem('coincount_app_state')) : {}
const store = createStore(
  rootReducer,
  persistedState,
  compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
)
store.subscribe(() => {
  localStorage.setItem('coincount_app_state', JSON.stringify(store.getState()))
})

ReactDOM.render((
  <Provider store={store}>
    <BrowserRouter>
      <Route component={App}/>
    </BrowserRouter>
  </Provider>
), document.getElementById('root'))
