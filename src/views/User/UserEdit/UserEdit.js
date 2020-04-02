import {makeStyles} from "@material-ui/styles";
import React, {useEffect, useState} from "react";
import Header from "./components/Header";
import Page from "components/Page";
import UserForm from "./components/UserForm";
import ChangePassword from "./components/ChangePassword";
import SuccessSnackbar from "./components/SuccessSnackbar";
import useRouter from 'utils/useRouter';
import {BASE_URL} from "../../../config";
import {addAuthorization} from "../../../utils/functions";
import ErrorSnackbar from "./components/ErrorSnackbar";

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

const UserEdit = () => {
  const errors = {
    403: "you don't have permission",
    401: "Unauthorized",
    404: "Not found",
    500: "Internal server error"
  };
  const [profile, setProfile] = useState({
    name: '',
    username: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: '',
  });
  const roles = {'ROLE_TOKENIST': 'tokenist', 'ROLE_STAFF': 'staff', 'ROLE_ADMIN': 'Admin'};
  const [id, setId] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const classes = useStyles();
  const router = useRouter();

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleErrorClose = () => {
    setOpenError(false);
  };

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

  const onEditedUser = () => {
    // redirect back to the list page
    // show the snackbar
    setOpenSnackbar(true);
    // redirect to the user list page
    setTimeout(() => {
      router.history.goBack('/user/list');
    }, 1000);
  };

  const handleSubmit = event => {
    event.preventDefault();
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders = addAuthorization(myHeaders);

    let raw = JSON.stringify({name: profile.name, role: [profile.role]});

    let requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw
    };

    fetch(BASE_URL + "/api/users/edit/" + id, requestOptions)
      .then(response => response.json())
      .then(result => {
        onEditedUser();
      })
      .catch(error => console.log('error', error));
  };

  const onChangePassword = event => {
    event.preventDefault();
    // check the password
    if (profile.password === profile.confirmPassword) {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders = addAuthorization(myHeaders);

      let raw = JSON.stringify({password: profile.password, confirmPassword: profile.confirmPassword});

      let requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw
      };

      fetch(BASE_URL + "/api/users/reset-password/" + id, requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status) {
            if (result.errors) {
              setErrorMessage(result.errors[0].field + ' ' + result.errors[0].defaultMessage);
            } else {
              setErrorMessage(result.message || '');
            }
            setOpenError(true);
          } else {
            setOpenSnackbar(true);
            setTimeout(() => {
              router.history.push('/user/list');
            }, 1000);
          }
        })
        .catch(error => console.log('error', error));
    } else {
      alert('password and confirm password should be same.')
    }
  };

  const setUser = user => {
    setProfile({
      ...profile,
      name: user.name,
      username: user.username,
      email: user.email,
      role: roles[user.roles[0].name],
      password: '',
      confirmPassword: ''
    });
  };

  useEffect(() => {
    let mounted = true;
    // get the id from the router

    setId(router.match.params.id);

    const fetchUser = () => {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders = addAuthorization(myHeaders);

      let requestOptions = {
        method: 'GET',
        headers: myHeaders
      };
      fetch(BASE_URL + "/api/users/" + router.match.params.id,requestOptions)
        .then(response => response.json())
        .then(result => {
          if (mounted) {
            if (!result.status) {
              setUser(result)
            } else {
              // show the error message
              setOpenError(true);
              setErrorMessage(errors[result.status])
            }
          }
        })
        .catch(error => console.log('error', error));
    };

    fetchUser();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Page
      className={classes.root}
      title="User Create"
    >
      <Header/>
      <UserForm
        profile={profile}
        className={classes.userForm}
        handleSubmit={handleSubmit}
        handleChange={handleChange}/>
      <ChangePassword
        profile={profile}
        className={classes.userForm}
        handleChange={handleChange}
        onChangePassword={onChangePassword}/>
      <SuccessSnackbar
        onClose={handleSnackbarClose}
        open={openSnackbar}
      />
      <ErrorSnackbar
        message={errorMessage}
        onClose={handleErrorClose}
        open={openError}/>
    </Page>
  )
};

export default UserEdit;
