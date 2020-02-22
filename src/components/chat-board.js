import React from 'react';
import '../App.css';
import 'antd/dist/antd.css';
import { Layout } from 'antd';
import ChatChannel from './chat-channel';
import ChatWindow from './chat-window';
import { uuid } from 'uuidv4';
import io from 'socket.io-client';
import axios from 'axios';
import { withRouter, Redirect, Link } from 'react-router-dom';

const { Sider, Header } = Layout;
const baseURL = process.env.NODE_ENV !== 'production' ? 'http://localhost:3000/' : 'http://rea-chat.herokuapp.com/';
const port = process.env.NODE_ENV !== 'production' ? 'http://localhost:3000'  : '/';


class ChatBoard extends React.Component {
    constructor(props){
        super(props);
        this.socket = io(port);       
        this.userInfo = {};
        this.state = {
            channels:[],
            selectedChannel:'',
            messages:[],
            channel:''    
        }

        this.initSocket = this.initSocket.bind(this);
        this.loadChannels = this.loadChannels.bind(this);
        if(this.props.history.location.state){
            this.userInfo = this.props.history.location.state.userInfo;
        }
    }  

    componentDidMount() {
        this.initSocket();
        this.loadChannels();       
    }

    initSocket() {
        this.socket.on('connection', (socket) => {
            console.log('Socket connected from client');
        })

        this.socket.on('message', (data) => {
            this.setState({
                messages:[...this.state.messages, {...data}]
            })     
        });

        this.socket.on('disconnect', () => {
            console.log('disconnected.. .!!')
        });
    }

    loadChannels() {
        axios({
            method:'GET',
            baseURL: baseURL,
            //url:'http://localhost:3000/getChannelsByUser/' + userId,
            url:'/getChannels',
            headers: { 'content-type':'Application/json' }
        })
        .then((res) => {
            this.setState({ channels: res.data});
            if(this.state.channels.length > 0) {
                this.onChannelChange(this.state.channels[0].channelId);
            }
        })
    }
    onChannelChange(selectedChannel) {
        this.loadConversation(selectedChannel);              
        let username = this.userInfo.username;
        this.socket.emit('join', { username, selectedChannel }, (error) => {
        });
    }

    loadConversation(selectedChannel) {
        axios({
            method: 'GET',
            baseURL: baseURL,
            url:'/getConversation/' + selectedChannel,
            headers: { 'content-type':'Application/json' },

        })
        .then((res) => {
            this.setState({
                messages: res.data,
                selectedChannel: selectedChannel
            })
        })
    }

    sendMessage(data) {
        this.socket.emit('sendMessage', data);
    }

    onChange(event) {
        this.setState({
            channel:event.target.value
        })
    }

    createChannel() {
        let createdBy  = this.userInfo.userId;
        axios({
            method:'POST',
            baseURL: baseURL,
            url:'/createChannel',
            headers: { 'content-type':'Application/json' },
            data: { channelName: this.state.channel, channelId: uuid(), createdBy: createdBy }
        })
        .then((res) => {
            this.setState({channels: [...this.state.channels, res.data]});
            this.setState({channel:''});
            this.onChannelChange(res.data.channelId);
        })
    }

    render() {
        if(!this.props.history.location.state){
            return <Redirect to="/login" />
        } else {
            return (
                <Layout>
                    <Header>Re-Chat
                        <span><Link to="/login"> &nbsp;Logout</Link></span>
                        <span>Hello {this.userInfo.username},</span>                      
                    </Header>
                    <Layout>
                    <Sider className='chat-channel-styles'>
                        <div className='no-scrollbar'>
                        {this.state.channels.map((channel) => {
                            return <ChatChannel key={channel.channelId} 
                                                channelId={channel.channelId} 
                                                name={channel.channelName}
                                                selectedChannel={this.state.selectedChannel}
                                                onChannelChange={this.onChannelChange.bind(this)}
                                    />
                        })}
                        </div>
                        <form className="msger-inputarea create-channel-textarea">
                            <input type="text" 
                                className="msger-input" 
                                placeholder="Create Channel"
                                onChange={this.onChange.bind(this)}
                                value={this.state.channel}/>
                            <button disabled={this.state.channel === ''} onClick={this.createChannel.bind(this)} className="msger-send-btn">Create</button>
                    </form>
                    </Sider>
                    {(this.state.channels.length > 0) ? 
                        <ChatWindow userInfo={this.userInfo} channelId={this.state.selectedChannel} sendMessage={this.sendMessage.bind(this)} messages={this.state.messages}/>: 
                        <div className='create-channel-msg'>
                            <span>Go ahead, create a channel and start talking !!</span>
                        </div>
                    }
                    
                    </Layout>
                </Layout>
            )
        }
    }
}

export default withRouter(ChatBoard);
