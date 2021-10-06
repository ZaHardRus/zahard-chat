export const appReducer = (state, action) => {
    switch (action.type) {
        case "SET_AUTH":
            return {
                ...state,
                roomId: action.payload.roomId,
                userName: action.payload.userName,
                isAuth: true,
            }
        case "SET_USERS":
            return {
                ...state,
                users: action.payload
            }
        case "NEW_MESSAGE":
            return {
                ...state,
                messages: [...state.messages,action.payload]
            }
        case "SET_MESSAGES":
            return {
                ...state,
                messages:action.payload
            }
        default:
            return state
    }
}