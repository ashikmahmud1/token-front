import {makeStyles} from "@material-ui/styles";
import React, {useEffect, useState} from "react";
import Header from "./components/Header";
import Page from "components/Page";
import CounterForm from "./components/CounterForm";
import {BASE_URL} from "../../../config";
import SuccessSnackbar from "./components/SuccessSnackbar";
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

const CounterEdit = () => {
  const [id, setId] = useState('');
  const [profile, setProfile] = useState({
    name: '',
    letter: ''
  });
  const router = useRouter();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const classes = useStyles();

  const handleChange = event => {
    event.persist();

    setProfile({
      ...profile,
      [event.target.name]:
        event.target.type === 'checkbox'
          ? event.target.checked
          : event.target.value
    });
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };
  const onCreatedCounter = (counter) => {
    console.log(counter);
    setOpenSnackbar(true);
    // redirect to the counter list page
    setTimeout(() => {
      router.history.push('/counter/list');
    }, 1000);
  };
  const handleSubmit = event => {
    event.preventDefault();
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let data = JSON.stringify(profile);

    let requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: data
    };

    fetch(BASE_URL + "/api/counters/" + id, requestOptions)
      .then(response => response.json())
      .then(result => onCreatedCounter(result))
      .catch(error => console.log('error', error));
  };

  useEffect(() => {
    let mounted = true;
    // get the id from the router

    setId(router.match.params.id);

    const fetchCounter = () => {
      fetch(BASE_URL + "/api/counters/" + router.match.params.id)
        .then(response => response.json())
        .then(result => {
          if (mounted) setProfile(result)
        })
        .catch(error => console.log('error', error));
    };

    fetchCounter();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Page
      className={classes.root}
      title="Counter Edit"
    >
      <Header/>
      <CounterForm
        profile={profile}
        className={classes.userForm}
        handleChange={handleChange}
        handleSubmit={handleSubmit}/>
      <SuccessSnackbar
        onClose={handleSnackbarClose}
        open={openSnackbar}
      />
    </Page>
  )
};

export default CounterEdit;
