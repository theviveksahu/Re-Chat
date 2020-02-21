import React from 'react';
import { Layout } from 'antd';
import Message from './message';
import io from 'socket.io-client';
import moment from 'moment';
const { Content, Footer } = Layout;

class ChatWindow extends React.Component {
    constructor(props){
        super(props);
        this.socket = io('localhost:3000');
        this.state = {
            message: ''
        }
    }

    componentDidMount() {
        
    }

    sendMessage(event) {
        let { channelId, sendMessage } = this.props;
        event.preventDefault();
        let data = {
            message: this.state.message,
            sender: this.props.userInfo.username,
            time: moment().format('lll'),
            channelId: channelId
        }
        this.setState({message:''});
        sendMessage(data);
    }

    handleChange(event) {
        this.setState({
            message: event.target.value
        })
    }

    render() {
        const { messages } = this.props;
        return (
            <Layout>
              <Content className='chat-window-styles'>
                  {
                      messages.map((msg) => {
                          return <Message key = {msg.message} messageInfo={msg} userInfo={this.props.userInfo}/>
                      })
                  }
              </Content>
              <Footer>
                  <form className="msger-inputarea">
                        <input type="text" 
                               className="msger-input" 
                               placeholder="Type your message..."
                               onChange={this.handleChange.bind(this)}
                               value={this.state.message}/>
                        <button onClick={this.sendMessage.bind(this)} type="submit" className="msger-send-btn">Send</button>
                  </form>
              </Footer>
            </Layout>
        )
    }
}

export default ChatWindow