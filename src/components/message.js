import React from 'react';

class Message extends React.Component {
    render() {
        const { messageInfo, userInfo }  = this.props;
        return (
            <div className={(messageInfo.sender === userInfo.username) ? "msg right-msg": "msg left-msg"}>
                <div className="msg-img"
                     ><span>{messageInfo.sender.slice(0,2).toUpperCase()}</span></div>
                       <div className="msg-bubble">
                            <div className="msg-info">
                                <div className="msg-info-name">{messageInfo.sender}</div>
                                <div className="msg-info-time">{messageInfo.time}</div>
                            </div>
                            <div className="msg-text">
                            {messageInfo.message}
                            </div>
                        </div>
            </div>
        )
    }

}

export default Message
