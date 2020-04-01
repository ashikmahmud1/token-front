import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/styles';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Divider,
  TextField,
  colors
} from '@material-ui/core';

import SuccessSnackbar from '../SuccessSnackbar';
import {BASE_URL} from "../../../../../../config";
import {addAuthorization} from "../../../../../../utils/functions";
import ErrorSnackbar from "../../../../../User/UserCreate/components/ErrorSnackbar";

const useStyles = makeStyles(theme => ({
  root: {},
  saveButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  }
}));

const GeneralSettings = props => {
  const {profile, className, ...rest} = props;

  const classes = useStyles();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [tokenUser, setTokenUser] = useState({});
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [values, setValues] = useState({
    password: '',
    confirmPassword: '',
    oldPassword: ''
  });

  const handleChange = event => {
    event.persist();

    setValues({
      ...values,
      [event.target.name]:
        event.target.type === 'checkbox'
          ? event.target.checked
          : event.target.value
    });
  };

  const onResetPassword = (result) => {
    if (result.status) {
      if (result.errors) {
        setErrorMessage(result.errors[0].field + ' ' + result.errors[0].defaultMessage);
      } else {
        setErrorMessage(result.message || '');
      }
      setOpenError(true);
    } else {
      setOpenSnackbar(true);
      // update the token user
      localStorage.setItem('token_user', JSON.stringify(result));
      setValues({...values, password: '', confirmPassword: '', oldPassword: ''});
    }
  };

  const handleSubmit = event => {
    event.preventDefault();
    // here send the request for change password
    if (values.password === values.confirmPassword) {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders = addAuthorization(myHeaders);
      let raw = JSON.stringify({
        password: values.password,
        confirmPassword: values.confirmPassword,
        oldPassword: values.oldPassword
      });

      let requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw
      };

      fetch(BASE_URL + "/api/users/me/reset-password/" + tokenUser.id, requestOptions)
        .then(response => response.json())
        .then(result => {
          onResetPassword(result);
        })
        .catch(error => console.log('error', error));
    } else {
      alert('password and confirm password should be same.')
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleErrorClose = () => {
    setOpenError(false);
  };

  useEffect(() => {
    if (localStorage.getItem('token_user')) {
      setTokenUser(JSON.parse(localStorage.getItem('token_user')))
    }
  }, []);

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <form onSubmit={handleSubmit}>
        <CardHeader title="Change Password"/>
        <Divider/>
        <CardContent>
          <Grid
            container
            spacing={4}
          >
            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                fullWidth
                label="Old password"
                name="oldPassword"
                onChange={handleChange}
                required
                type="password"
                value={values.oldPassword}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                fullWidth
                label="New password"
                name="password"
                onChange={handleChange}
                required
                type="password"
                value={values.password}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                fullWidth
                label="Confirm password"
                name="confirmPassword"
                onChange={handleChange}
                required
                type="password"
                value={values.confirmPassword}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider/>
        <CardActions>
          <Button
            className={classes.saveButton}
            type="submit"
            variant="contained"
          >
            Save Changes
          </Button>
        </CardActions>
      </form>
      <SuccessSnackbar
        onClose={handleSnackbarClose}
        open={openSnackbar}
      />
      <ErrorSnackbar
        message={errorMessage}
        onClose={handleErrorClose}
        open={openError}/>
    </Card>
  );
};

GeneralSettings.propTypes = {
  className: PropTypes.string,
  profile: PropTypes.object.isRequired
};

export default GeneralSettings;
