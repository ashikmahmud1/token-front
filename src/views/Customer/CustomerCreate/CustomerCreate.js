import {makeStyles} from "@material-ui/styles";
import React, {useState} from "react";
import Header from "./components/Header";
import Page from "components/Page";
import CustomerForm from "./components/CustomerForm";

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

const CustomerCreate = () => {
  const [profile] = useState({
    name: '',
    number: '',
    contact: '',
    age: ''
  });
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Customer Create"
    >
      <Header/>
      <CustomerForm
        profile={profile}
        className={classes.userForm}/>
    </Page>
  )
};

export default CustomerCreate;
