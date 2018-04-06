export const UPDATE_DEVICES = 'lists/FETCH_DEVICES'

const initialState = {
  devices: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_DEVICES:
      return {
        ...state,
        devices: action.devices,
      }

    default:
      return state
  }
}

export const updateDevices = (devices) => {
  return dispatch => {

    dispatch({
      type: UPDATE_DEVICES,
      devices,
    })

  }
}