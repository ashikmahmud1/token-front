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

      fetch(BASE_URL + "/api/users/reset-password/" + tokenUser.id, requestOptions)
        .then(response => response.json())
        .then(result => {
          setOpenSnackbar(true);
          // update the token user
          localStorage.setItem('token_user', JSON.stringify(result));
          setValues({...values, password: '', confirmPassword: '', oldPassword: ''});
        })
        .catch(error => console.log('error', error));
    } else {
      alert('password and confirm password should be same.')
    }
    console.log(values);
    setOpenSnackbar(true);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
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
    </Card>
  );
};

GeneralSettings.propTypes = {
  className: PropTypes.string,
  profile: PropTypes.object.isRequired
};

export default GeneralSettings;
