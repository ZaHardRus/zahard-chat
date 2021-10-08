import React from 'react';
import socket from '../../socket/socket';
import classNames from "classnames";

export const Chat = ({users, messages, userName, roomId, onAddMessage}) => {
    const [messageValue, setMessageValue] = React.useState('');
    const [visible, setVisible] = React.useState(window.innerWidth >= 768)
    const messagesRef = React.useRef(null);
    const swapVisible = (e) => {
        e.preventDefault()
        setVisible(prev => !prev)
    }
    const onSendMessage = () => {
        if (messageValue === '') return
        socket.emit('ROOM:NEW_MESSAGE', {
            userName,
            roomId,
            text: messageValue,
        });
        onAddMessage({userName, text: messageValue, date: Date.now()});
        setMessageValue('');
    };
    const disconnect = () => {
        window.location.reload()
    }
    React.useEffect(() => {
        messagesRef.current.scrollTo(0, messagesRef.current.scrollHeight);
    }, [messages]);

    return (
        <div className="chat">
            <div className={visible ? 'chat-users chat-users--active' : 'chat-users'}>
                <div>
                    <p>Комната: <b>{roomId}</b></p>
                    <p>Онлайн:<b> ({users.length})</b></p>
                    <ul>
                        {users.map((name, index) => (
                            <li className={name === userName ? 'current-user--active' : 'current-user'}
                                key={name + index}>
                                {name === userName ? `Вы: ${name}` : name}
                            </li>
                        ))}
                    </ul>
                </div>

                <button onClick={disconnect} className={'btn btn-danger'}>Выход</button>
            </div>
            <div className="chat-messages">
                <div ref={messagesRef} className="messages">
                    {messages.map((message, i) => (
                        <div key={message + i}
                             className={classNames('message', {myMessage: message.userName === userName})}>
                            <p>{message.text}</p>
                            <div className={'message-info'}>
                                <span>{message.userName}</span>
                                <span>{new Date(message.date).toTimeString().split(' ')[0]}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <form>
                    <input
                        placeholder={'Напишите сообщение...'}
                        value={messageValue}
                        onChange={(e) => setMessageValue(e.target.value)}
                        className="form-control"
                    />
                    <div className="btns">
                        <button
                            onClick={onSendMessage}
                            type="button"
                            className="btn btn-primary">
                            Отправить
                        </button>
                        <button className={'info btn btn-outline'} onClick={swapVisible}>О комнате</button>
                    </div>
                </form>
            </div>
        </div>
    );
}