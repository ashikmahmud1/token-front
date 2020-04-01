import React, {useState} from 'react';
import {makeStyles} from '@material-ui/styles';

import {Page} from 'components';
import {Header, QueueNumber} from './components';
import Box from "@material-ui/core/Box";
import SocketConnection from "../../components/SocketConnection";


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  }
}));

const Dashboard = () => {
  const classes = useStyles();
  const [departmentTokens, setDepartmentTokens] = useState({});

  const onTokenCreated = (departmentTokens) => {
    onSetTokens(departmentTokens);
  };

  const onTokenServed = (departmentTokens) => {
    onSetTokens(departmentTokens);
  };

  const onTokenCalled = (departmentTokens) => {
    onSetTokens(departmentTokens);
  };

  const onTokenDeleted = (departmentTokens) => {
    onSetTokens(departmentTokens);
  };

  const onTokenReset = (departmentTokens) => {
    onSetTokens(departmentTokens);
  };

  const onSetTokens = (departmentTokens) => {
    setDepartmentTokens(departmentTokens);
  };

  return (
    <Page
      className={classes.root}
      title="Total Waiting Queue"
    >
      <Header/>
      <Box display="flex" width="100%">
        {
          Object.keys(departmentTokens).map(key => {
            return (
              <QueueNumber departmentTokens={departmentTokens[key]}
                           key={key}
                           totalItems={Object.keys(departmentTokens).length}/>
            )
          })
        }
      </Box>
      <SocketConnection
        onTokenCreated={onTokenCreated}
        onTokenServed={onTokenServed}
        onTokenCalled={onTokenCalled}
        onTokenDeleted={onTokenDeleted}
        onTokenReset={onTokenReset}
        onSetTokens={onSetTokens}/>
    </Page>
  );
};

export default Dashboard;
