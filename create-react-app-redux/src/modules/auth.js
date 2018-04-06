export const LOGIN_REQUESTED = 'auth/LOGIN_REQUESTED'
export const LOGIN_ACCEPTED = 'auth/LOGIN_ACCEPTED'
export const LOGIN_UNACCEPTED = 'auth/LOGIN_UNACCEPTED'
export const SET_SESSION = 'auth/SET_SESSION'
export const LOGOUT = 'auth/LOGOUT'

const initialState = {
  username: "",
  logged_in: false,
  is_logging: false,
  token: "",
  user_id: -1
}

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUESTED:
      return {
        ...state,
        is_logging: true
      }

    case LOGIN_ACCEPTED:
      return {
        ...state,
        logged_in: true,
        is_logging: false
      }

    case LOGIN_UNACCEPTED:
      return {
        ...state,
        logged_in: false,
        is_logging: false
      }
    
    case LOGOUT:
      return {
        ...state,
        username: "",
        logged_in: false,
        user_id: -1,
      }

    case SET_SESSION:
      return {
        ...state,
        username: action.username,
        token: action.token,
        user_id: action.user_id
      }

    default:
      return state
  }
}

export const loginAccepted = (username, token, user_id) => {
  return dispatch => {
    dispatch({
      type: LOGIN_REQUESTED
    })

    dispatch({
      type: LOGIN_ACCEPTED
    })

    dispatch({
      type: SET_SESSION,
      username,
      token,
      user_id
    })
  }
}

export const loginUnaccepted = () => {
  return dispatch => {
    dispatch({
      type: LOGIN_REQUESTED
    })

    dispatch({
      type: LOGIN_UNACCEPTED
    })

  }
}

export const logout = () => {
  return dispatch => {
    dispatch({
      type: LOGOUT
    })

  }
}