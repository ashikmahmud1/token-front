import {makeStyles} from "@material-ui/styles";
import React, {useState} from "react";
import Header from "./components/Header";
import Page from "components/Page";
import TokenForm from "./components/TokenForm";
import useRouter from 'utils/useRouter';

const useStyles = makeStyles(theme => ({
  root: {
    width: theme.breakpoints.values.lg,
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3, 3, 6, 3)
  },
  userForm: {
    marginTop: theme.spacing(3)
  },
}));

const TokenCreate = () => {
  const [profile] = useState({
    customer_id: '',
    department_id: ''
  });
  const classes = useStyles();
  const {history} = useRouter();

  console.log(history.location.pathname);

  return (
    <Page
      className={classes.root}
      title="Department Create"
    >
      <Header/>
      <TokenForm
        profile={profile}
        className={classes.userForm}/>
    </Page>
  )
};

export default TokenCreate;
