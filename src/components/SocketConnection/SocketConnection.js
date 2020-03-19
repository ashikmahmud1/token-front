import React from "react";
import PropTypes from "prop-types";
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {BASE_URL} from "../../config";

class SocketConnection extends React.Component {

  serverUrl = BASE_URL + '/ws';

  constructor(props) {
    super(props);
    this.state = {
      departmentTokens: {}
    }
  }

  onTokenCreated = (token) => {
    const department_tokens = {...this.state.departmentTokens};
    //  check if the departmentTokens contains the key token.department.id
    // if key exist then add the token in the departmentTokens[token.department.id].tokens.push(token);
    if (department_tokens[token.department.id]) {
      let found = department_tokens[token.department.id].tokens.find(t => t.id === token.id);
      if (!found) {
        department_tokens[token.department.id].tokens.push(token);
        // sort by created date
        department_tokens[token.department.id].tokens.sort(function (a, b) {
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return new Date(a.updatedAt) - new Date(b.updatedAt);
        });
        // sort by priority
        department_tokens[token.department.id].tokens.sort(function (a, b) {
          return b.priority - a.priority
        });
      }
      this.props.onTokenCreated(department_tokens);
    }
    this.setState({departmentTokens: department_tokens});
  };

  onTokenUpdated = (token) => {
    const department_tokens = {...this.state.departmentTokens};
    //  check if the departmentTokens contains the key token.department.id
    // if key exist then add the token in the departmentTokens[token.department.id].tokens.findIndex(t => t.id === token.id);
    if (department_tokens[token.department.id]) {
      let token_index = department_tokens[token.department.id].tokens.findIndex(t => t.id === token.id);
      // check if the token status is TOKEN_SERVED then remove the token from the token list
      // else set the token new value
      if (token.status === 'TOKEN_SERVED' || token.status === 'TOKEN_NOT_CAME') {
        department_tokens[token.department.id].tokens = department_tokens[token.department.id].tokens.filter(t => t.id !== token.id);
        this.props.onTokenServed(department_tokens);
      } else {
        // This means token is called.
        // play the sound with token calling with token number
        // finally update the token
        let message = 'token ' + token.token_number + ' counter ' + token.counter.letter;
        department_tokens[token.department.id].tokens[token_index] = token;
        this.props.onTokenCalled(department_tokens, message);
      }
    }
    this.setState({departmentTokens: department_tokens});
  };

  onTokenDeleted = (token) => {
    const department_tokens = {...this.state.departmentTokens};
    //  check if the departmentTokens contains the key token.department.id
    if (department_tokens[token.department.id]) {
      let token_index = department_tokens[token.department.id].tokens.findIndex(t => t.id === token.id);
      department_tokens[token.department.id].tokens.splice(token_index, 1);
      this.props.onTokenDeleted(department_tokens);
    }
    this.setState({departmentTokens: department_tokens});
  };

  openGlobalSocket = () => {
    // subscribe all this three channel
    // name of the broker is topics
    // subscribe to the /topics/tokens/created
    this.stompClient.subscribe('/topics/tokens/created', (message) => {
      this.onTokenCreated(JSON.parse(message.body));
    });
    // subscribe to the /topics/tokens/updated
    this.stompClient.subscribe('/topics/tokens/updated', (message) => {
      this.onTokenUpdated(JSON.parse(message.body));
    });
    // subscribe to the /topics/tokens/deleted
    this.stompClient.subscribe('/topics/tokens/deleted', (message) => {
      this.onTokenDeleted(JSON.parse(message.body));
    });
  };

  initializeSocket = () => {
    const ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    const self = this;
    this.stompClient.connect({}, function (frame) {
      self.openGlobalSocket();
    });
  };

  componentDidMount() {
    this.initializeSocket();
  }

  render() {
    return (
      <React.Fragment/>
    )
  }
}

SocketConnection.propTypes = {
  onTokenCreated: PropTypes.func.isRequired,
  onTokenServed: PropTypes.func.isRequired,
  onTokenCalled: PropTypes.func.isRequired,
  onTokenDeleted: PropTypes.func.isRequired,
  onTokenReset: PropTypes.func.isRequired
};
export default SocketConnection;
