import React, {Component} from 'react';
import stompClient from "utils/socket";

import {Page} from 'components';
import {BASE_URL} from "../../../config";
import QueueColumn from "./components/QueueColumn";
import {makeStyles} from "@material-ui/styles";
import useRouter from 'utils/useRouter';

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

  onTokenCreated = (token) => {
    const department_tokens = {...this.state.departmentTokens};
    //  check if the departmentTokens contains the key token.department.id
    // if key exist then add the token in the departmentTokens[token.department.id].tokens.push(token);
    if (department_tokens[token.department.id]) {
      department_tokens[token.department.id].tokens.push(token);
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
        department_tokens[token.department.id].tokens.splice(token_index, 1);
      } else {
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
    stompClient.subscribe('/topics/tokens/created', (message) => {
      this.onTokenCreated(JSON.parse(message.body));
    });
    // subscribe to the /topics/tokens/updated
    stompClient.subscribe('/topics/tokens/updated', (message) => {
      this.onTokenUpdated(JSON.parse(message.body));
    });
    // subscribe to the /topics/tokens/deleted
    stompClient.subscribe('/topics/tokens/deleted', (message) => {
      this.onTokenDeleted(JSON.parse(message.body));
    });
  };

  initializeSocket = () => {
    const self = this;
    stompClient.connect({}, function (frame) {
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
      department_tokens[department.id] = {department, tokens: tokens.filter(t => t.department.id === department.id)}
    });
    this.setState({departmentTokens: department_tokens});
  };

  render() {
    const {departmentTokens} = this.state;
    const {classes} = this.props;

    return (
      <Page
        className={classes.root}
        title="Token Queue List"
      >
        <div className={classes.content}>
          <div className={classes.queueRows}>
            {
              Object.keys(departmentTokens).map(key => {
                return (
                  <QueueColumn departmentTokens={departmentTokens[key]} key={key}/>
                )
              })
            }
          </div>
        </div>
      </Page>
    )
  }
}

export default TokenQueueList;
