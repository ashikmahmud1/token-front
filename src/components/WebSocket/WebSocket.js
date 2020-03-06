import React, {Component} from "react";
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {BASE_URL} from "../../config";

class WebSocket extends Component {
    serverUrl = BASE_URL + '/ws';

    constructor(props) {
        super(props);
        this.state = {
            tokens: []
        }
    }

    initializeSocket = () => {
        const ws = new SockJS(this.serverUrl);
        this.stompClient = Stomp.over(ws);
        const self = this;
        this.stompClient.connect({}, function (frame) {
            console.log('connected');
            self.openGlobalSocket();
        });
    };

    onNewTokenCreated = (token) => {
        const tokens = [...this.state.tokens];
        tokens.push(token);
        this.setState({tokens});
    };


    openGlobalSocket = () => {
        // subscribe all this three channel
        // name of the broker is topics
        this.stompClient.subscribe('/topics/tokens/created', (message) => {
            this.onNewTokenCreated(JSON.parse(message.body));
        });
        // subscribe to the /topics/tokens/created
        // subscribe to the /topics/tokens/deleted
        // subscribe to the /topics/tokens/updated
    };

    componentDidMount() {
        // initialize the websocket connection
        this.initializeSocket();
    }

    render() {
        return (
            <div>
                {/*Show the list of tokens*/}
                {
                    this.state.tokens.map((token, key) => {
                        return (
                            <li key={key}>{token.token_number}</li>
                        )
                    })
                }
            </div>
        );
    }


}

export default WebSocket;
