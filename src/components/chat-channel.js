import React from 'react';
import '../App.css';

class ChatChannel extends React.Component {
    loadChannel() {
        const { channelId, onChannelChange } = this.props;
        onChannelChange(channelId);
    }
    
    render() {
        const { channelId, selectedChannel } = this.props;
        return (
            <div className="chat-channel" style= {{ backgroundImage: channelId === selectedChannel ? 'linear-gradient(to right,rgb(201, 187, 218), rgb(151, 157, 175))': 'none'}} onClick={this.loadChannel.bind(this)}>
                <div className="msg-img">{this.props.name.slice(0,2).toUpperCase()}</div>
                <span>{this.props.name}</span>
            </div>
        )
    }
}

export default ChatChannel;
