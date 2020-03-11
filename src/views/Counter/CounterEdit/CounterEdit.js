import {makeStyles} from "@material-ui/styles";
import React, {useState} from "react";
import Header from "./components/Header";
import Page from "components/Page";
import UserForm from "./components/UserForm";

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

const CounterEdit = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    state: 'ROLE_TOKENIST',
    country: '',
    isPublic: true,
    canHire: true
  });
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="User Create"
    >
      <Header/>
      <UserForm
        profile={profile}
        className={classes.userForm}/>
    </Page>
  )
};

export default CounterEdit;
