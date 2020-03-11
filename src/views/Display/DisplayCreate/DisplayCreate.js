import {makeStyles} from "@material-ui/styles";
import React, {useEffect, useState} from "react";
import Header from "./components/Header";
import Page from "components/Page";
import DisplayForm from "./components/DisplayForm";
import {BASE_URL} from "../../../config";

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

const DisplayCreate = () => {
  const [profile, setProfile] = useState({
    name: '',
    departments: []
  });
  const classes = useStyles();

  // get all the departments
  useEffect(() => {
    let mounted = true;

    const fetchDepartments = () => {
      fetch(BASE_URL + "/api/departments/")
        .then(response => response.json())
        .then(result => setProfile({...profile, departments: result}))
        .catch(error => console.log('error', error));
    };

    fetchDepartments();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Page
      className={classes.root}
      title="Display Create"
    >
      <Header/>
      <DisplayForm
        profile={profile}
        className={classes.userForm}/>
    </Page>
  )
};

export default DisplayCreate;
