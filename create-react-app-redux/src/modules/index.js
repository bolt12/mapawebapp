import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import auth from './auth'
import lists from './lists'
import devices from './devices'

export default combineReducers({
  router: routerReducer,
  auth,
  lists,
  devices,
})
