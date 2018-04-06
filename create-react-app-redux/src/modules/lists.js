export const UPDATE_LISTS = 'lists/FETCH_LISTS'
export const UPDATE_TASKS = 'lists/FETCH_TASKS'

const initialState = {
  lists: [],
  tasks: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_LISTS:
      return {
        ...state,
        lists: action.lists,
      }

    case UPDATE_TASKS:
      return {
        ...state,
        tasks: action.tasks,
      }

    default:
      return state
  }
}

export const updateListsTasks = (lists, tasks) => {
  return dispatch => {

    dispatch({
      type: UPDATE_LISTS,
      lists,
    })

    dispatch({
      type: UPDATE_TASKS,
      tasks,
    })

  }
}
  
export const updateLists = (lists) => {
  return dispatch => {

    dispatch({
      type: UPDATE_LISTS,
      lists,
    })

  }
}

export const updateTasks = (tasks) => {
  return dispatch => {

    dispatch({
      type: UPDATE_TASKS,
      tasks,
    })

  }
}