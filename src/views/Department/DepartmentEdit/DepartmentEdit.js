import {makeStyles} from "@material-ui/styles";
import React, {useState} from "react";
import Header from "./components/Header";
import Page from "components/Page";
import DepartmentForm from "./components/DepartmentForm";

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

const DepartmentEdit = () => {
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
      <DepartmentForm
        profile={profile}
        className={classes.userForm}/>
    </Page>
  )
};

export default DepartmentEdit;
