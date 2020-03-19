import React, {Component} from 'react';

import {Page} from 'components';
import {BASE_URL} from "../../../config";
import QueueColumn from "./components/QueueColumn";
import {makeStyles} from "@material-ui/styles";
import useRouter from 'utils/useRouter';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import Box from "@material-ui/core/Box";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
    paddingTop: '10vh',
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    overflowX: 'scroll'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(0, 3, 3, 1),
    overflowX: 'auto',
    overflowY: 'hidden',
    whiteSpace: 'nowrap'
  },
  imageContainer: {
    marginTop: theme.spacing(6),
    display: 'flex',
    justifyContent: 'center'
  },
  image: {
    maxWidth: '100%',
    width: 560,
    maxHeight: 300,
    height: 'auto'
  },
  buttonContainer: {
    marginTop: theme.spacing(6),
    display: 'flex',
    justifyContent: 'center'
  },
  queueRows: {
    display: 'flex'
  }
}));


const TokenQueueList = () => {
  const classes = useStyles();
  const router = useRouter();

  return (
    <QueueList classes={classes} router={router}/>
  )

};

class QueueList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      departmentTokens: {}
    }
  }

  serverUrl = BASE_URL + '/ws';

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
        department_tokens[token.department.id].tokens = department_tokens[token.department.id].tokens.filter(t => t.id !== token.id)
      } else {
        // This means token is called.
        // play the sound with token calling with token number
        if ('speechSynthesis' in window) {
          // Synthesis support. Make your web apps talk!
          let msg = new SpeechSynthesisUtterance('token ' + token.token_number + ' counter ' + token.counter.letter);
          window.speechSynthesis.speak(msg);
        }
        // finally update the token
        department_tokens[token.department.id].tokens[token_index] = token;
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
    const {router} = this.props;
    // initialize the websocket connection
    if (router.match.params.number) {
      this.fetchDisplay(router.match.params.number);
      this.initializeSocket();
    }
  }

  fetchDisplay = (number) => {
    // fetch settings

    // fetch departments by display id
    // /api/departments/{display_id}/departments
    fetch(BASE_URL + `/api/displays/number/${number}`)
      .then(response => response.json())
      .then(data => {
        this.fetchTokens(data);
        // after fetching all the departments fetch all the tokens
      })
  };

  fetchTokens = (display) => {
    let departments = display.departments || [];
    fetch(BASE_URL + '/api/tokens/today')
      .then(response => response.json())
      .then(data => {
        this.arrangeDepartmentTokens(departments, data);
      })
  };

  arrangeDepartmentTokens = (departments, tokens) => {
    const department_tokens = {};
    departments.forEach(department => {
      department_tokens[department.id] = {department, tokens: tokens.filter(t => t.department.id === department.id)};
      // sort by created date
      department_tokens[department.id].tokens.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(a.updatedAt) - new Date(b.updatedAt);
      });
      // sort by priority
      department_tokens[department.id].tokens.sort(function (a, b) {
        return b.priority - a.priority
      });
    });
    this.setState({departmentTokens: department_tokens});
  };

  render() {
    const {departmentTokens} = this.state;
    const {classes} = this.props;
    const totalItems = Object.keys(departmentTokens).length;

    return (
      <Page
        className={classes.root}
        title="Token Queue List"
      >
        <Box display="flex" p={1} width="100%">
          {
            Object.keys(departmentTokens).map(key => {
              return (
                <QueueColumn departmentTokens={departmentTokens[key]} key={key} totalItems={totalItems}/>
              )
            })
          }
        </Box>
      </Page>
    )
  }
}

export default TokenQueueList;
