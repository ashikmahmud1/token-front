import React, {Component} from 'react';

import {Page} from 'components';
import {BASE_URL} from "../../../config";
import QueueColumn from "./components/QueueColumn";
import {makeStyles} from "@material-ui/styles";
import useRouter from 'utils/useRouter';
import Box from "@material-ui/core/Box";
import SocketConnection from "../../../components/SocketConnection";

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
      departmentTokens: {},
      displayDepartments: []
    }
  }

  onTokenCreated = (departmentTokens) => {
    console.log('created new token');
    if (departmentTokens)
      this.setState({departmentTokens});
  };

  onTokenServed = (departmentTokens) => {
    if (departmentTokens)
      this.setState({departmentTokens});
  };

  onTokenCalled = (departmentTokens, message) => {
    if ('speechSynthesis' in window) {
      // Synthesis support. Make your web apps talk!
      let msg = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(msg);
    }
    if (departmentTokens)
      this.setState({departmentTokens});
  };

  onTokenDeleted = (departmentTokens) => {
    if (departmentTokens)
      this.setState({departmentTokens});
  };

  onTokenReset = (department) => {
    console.log(department);
  };

  onSetTokens = (departmentTokens) => {
    let department_tokens = {};
    this.state.displayDepartments.forEach(dd => {
      department_tokens[dd.id] = departmentTokens[dd.id];
    });
    this.setState({departmentTokens: department_tokens});
  };

  componentDidMount() {
    const {router} = this.props;
    if (router.match.params.number) {
      this.fetchDisplay(router.match.params.number);
    }
  }

  fetchDisplay = (number) => {
    // fetch settings

    // fetch departments by display id
    // /api/departments/{display_id}/departments
    fetch(BASE_URL + `/api/displays/number/${number}`)
      .then(response => response.json())
      .then(display => {
        this.setState({...this.state, displayDepartments: display.departments || []});
      })
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
        <SocketConnection
          onTokenCreated={this.onTokenCreated}
          onTokenServed={this.onTokenServed}
          onTokenCalled={this.onTokenCalled}
          onTokenDeleted={this.onTokenDeleted}
          onTokenReset={this.onTokenReset}
          onSetTokens={this.onSetTokens}/>
      </Page>
    )
  }
}

export default TokenQueueList;
