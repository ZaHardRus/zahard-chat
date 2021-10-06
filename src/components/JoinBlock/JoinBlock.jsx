import React from 'react';
import axios from "axios";

export const JoinBlock = ({onLogin, isAuth}) => {
    const [roomId, setRoomId] = React.useState('')
    const [userName, setUserName] = React.useState('')
    const [password, setPassword] = React.useState('')

    const sendData = () => {
        if (!roomId || !userName) {
            alert('Введены неверные данные')
            return
        }
        const form = {roomId, userName, password}
        axios.post('/rooms', form)
            .then(() => onLogin(form))
            .catch(err => alert('Введен неверный пароль от комнаты'))
    }
    return (
        <div className="join-block">
            <input value={roomId} onChange={e => setRoomId(e.target.value)} placeholder="Room ID"/>
            <input value={password} type={'password'} onChange={e => setPassword(e.target.value)} placeholder="Password"/>
            <input value={userName} onChange={e => setUserName(e.target.value)} placeholder="Ваше имя"/>
            <button
                disabled={isAuth}
                onClick={sendData}
                className="btn btn-primary"
            >{isAuth ? 'ВХОД...' : 'ВОЙТИ'}</button>
        </div>
    );
}