import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/styles';

import { Page } from 'components';
import {
  Header,
  FAQ,
  PluginsSupport,
  SourceFiles,
  UserFlows
} from './components';
import useRouter from 'utils/useRouter';

const useStyles = makeStyles(() => ({
  root: {}
}));

const Presentation = () => {
  const classes = useStyles();
  const {history} = useRouter();
  const redirect = {ROLE_TOKENIST:'/customer/list', ROLE_STAFF:'/call/token',ROLE_ADMIN:'/user/list'};
  useEffect(() => {
    if (localStorage.getItem('token_user')) {
      const token_user = JSON.parse(localStorage.getItem('token_user'));
      // check the role of the user.
      // if user role staff then redirect to the token-call
      // if user role tokenist then redirect to the customer list
      // else redirect to the user list
      history.push(redirect[token_user.roles[0]]);
    }
  }, []);
  return (
    <Page
      className={classes.root}
      title="Presentation"
    >
      <Header />
      <UserFlows />
      <PluginsSupport />
      <SourceFiles />
      <FAQ />
    </Page>
  );
};

export default Presentation;
