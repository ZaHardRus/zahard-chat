import React from "react";
import socket from "./socket/socket";
import {JoinBlock} from "./components/JoinBlock/JoinBlock";
import {Chat} from "./components/Chat/Chat";
import {useReducer} from "react";
import {appReducer} from "./reducers/appReducer";
import axios from "axios";

function App() {
    const [state, dispatch] = useReducer(appReducer, {
        isAuth: false,
        roomId: null,
        userName: null,
        users: [],
        messages: [],
    })

    const onLogin = (obj) => {
        dispatch({type: 'SET_AUTH', payload: obj});
        try {
            socket.emit('ROOM:JOIN', obj);
            axios.get(`/rooms/${obj.roomId}`)
                .then(res => {
                        dispatch({type: 'SET_USERS', payload: res.data.users});
                        dispatch({type: 'SET_MESSAGES', payload: res.data.messages});
                    }
                )
        } catch (e) {
            alert('Произошла ошибка при подключении...')
        }

    }
    const setUsers = (users) => dispatch({type: 'SET_USERS', payload: users});
    const addMessage = (message) => dispatch({type: 'NEW_MESSAGE', payload: message});

    React.useEffect(() => {
        socket.on('ROOM:JOINED', setUsers);
        socket.on('ROOM:LEAVE', setUsers);
        socket.on('ROOM:SET_NEW_MESSAGE', addMessage);
    }, [])
    return (
        <div className='wrapper'>
            {state.isAuth
                ? <Chat
                    userName={state.userName}
                    users={state.users}
                    messages={state.messages}
                    onAddMessage={addMessage}
                    roomId={state.roomId}
                />
                : <JoinBlock
                    onLogin={onLogin}
                    isAuth={state.isAuth}
                />}
        </div>
    );
}

export default App;
