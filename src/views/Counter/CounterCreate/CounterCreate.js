import {makeStyles} from "@material-ui/styles";
import React, {useState} from "react";
import Header from "./components/Header";
import Page from "components/Page";
import CounterForm from "./components/CounterForm";

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

const CounterCreate = () => {
  const [profile, setProfile] = useState({
    name: '',
    letter: '',
  });
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Counter Create"
    >
      <Header/>
      <CounterForm
        profile={profile}
        className={classes.userForm}/>
    </Page>
  )
};

export default CounterCreate;
