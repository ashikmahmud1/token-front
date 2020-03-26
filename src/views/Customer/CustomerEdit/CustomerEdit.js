import {makeStyles} from "@material-ui/styles";
import React, {useEffect, useState} from "react";
import Header from "./components/Header";
import Page from "components/Page";
import CustomerForm from "./components/CustomerForm";
import {BASE_URL} from "../../../config";
import useRouter from 'utils/useRouter';
import SuccessSnackbar from "./components/SuccessSnackbar";

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

const CustomerEdit = () => {
  const classes = useStyles();
  const router = useRouter();
  const [id, setId] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    number: '',
    contact: '',
    age: ''
  });

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

  const onCreatedCustomer = (result) => {
    console.log(result);
    // show the snackbar
    setOpenSnackbar(true);
    // redirect to the customer list page
    setTimeout(() => {
      router.history.push('/customer/list');
    }, 1000);
  };
  const handleSubmit = event => {
    event.preventDefault();
    // send the create customer request
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let data = JSON.stringify(profile);

    let requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: data
    };

    fetch(BASE_URL + "/api/customers/" + id, requestOptions)
      .then(response => response.json())
      .then(result => onCreatedCustomer(result))
      .catch(error => console.log('error', error));
  };

  useEffect(() => {
    let mounted = true;
    // get the id from the router

    setId(router.match.params.id);

    const fetchCustomer = () => {
      fetch(BASE_URL + "/api/customers/" + router.match.params.id)
        .then(response => response.json())
        .then(result => {
          if (mounted) setProfile(result)
        })
        .catch(error => console.log('error', error));
    };

    fetchCustomer();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Page
      className={classes.root}
      title="User Edit"
    >
      <Header/>
      <CustomerForm
        profile={profile}
        className={classes.userForm}
        handleSubmit={handleSubmit}
        handleChange={handleChange}/>
      <SuccessSnackbar
        onClose={handleSnackbarClose}
        open={openSnackbar}
      />
    </Page>
  )
};

export default CustomerEdit;
