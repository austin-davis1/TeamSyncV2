import { combineReducers } from "redux";

const bugs = (state = [], action) => {
    switch (action.type) {
        case "SET_DATA":
            return action.data
        default:
            return state
    }
}

const projects = (state = [], action) => {
    switch (action.type) {
        case "SET_PROJECTS":
            return action.data
        default:
            return state
    }
}

const isLoading = (state = true, action) => {
    switch (action.type) {
        case "SET_LOAD":
            return action.loading
        default:
            return state
    }
}

const needsRefresh = (state = false, action) => {
    switch (action.type) {
        case "NEED_REFRESH":
            return action.data
        default:
            return state
    }
}

const deleteModal = (state = false, action) => {
    switch (action.type) {
        case "MODAL_SWITCH":
            return action.data
        default:
            return state
    }
}

const selectedDelete = (state = null, action) => {
    switch (action.type) {
        case "DELETE_ID":
            return action.data
        default:
            return state
    }
}

const modalType = (state = "", action) => {
    switch(action.type) {
        case "MODAL_TYPE":
            return action.data
        default:
            return state
    }
}

const dashboardView = (state = "", action) => {
    switch(action.type) {
        case "SET_VIEW":
            return action.data
        default:
            return state
    }
}

const users = (state = null, action) => {
    switch (action.type) {
        case "SET_USERS":
            return action.data
        default:
            return state
    }
}

const isLoggedIn = (state = false, action) => {
    switch (action.type) {
        case "SET_LOGIN":
            return action.data
        default:
            return state
    }
}

const profilePictures = (state = null, action) => {
    switch (action.type) {
        case "SET_PROFILE_PICTURES":
            return action.data
        default:
            return state
    }
}

const allReducers = combineReducers({
    bugs, projects, isLoading, needsRefresh, 
    deleteModal, selectedDelete, modalType, dashboardView,
    users, isLoggedIn, profilePictures
})


export default allReducers;