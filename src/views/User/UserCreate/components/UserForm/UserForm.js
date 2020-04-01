import React, {useState} from 'react';
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
import useRouter from 'utils/useRouter';
import SuccessSnackbar from '../SuccessSnackbar';
import {BASE_URL} from "../../../../../config";
import {addAuthorization} from "../../../../../utils/functions";
import ErrorSnackbar from "../ErrorSnackbar";

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

const UserForm = props => {
  const {profile, className, ...rest} = props;
  const router = useRouter();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const classes = useStyles();
  const [values, setValues] = useState({
    name: profile.name,
    username: profile.username,
    email: profile.email,
    role: profile.role,
    password: profile.password,
    confirmPassword: profile.confirmPassword,
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

  const handleErrorClose = () => {
    setOpenError(false);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const onCreatedUser = (result) => {
    console.log(result);
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
  };

  const handleSubmit = event => {
    event.preventDefault();
    const user = {...values, role: [values.role]};

    if (user.password === user.confirmPassword) {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders = addAuthorization(myHeaders);
      let data = JSON.stringify(user);

      let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: data
      };

      fetch(BASE_URL + "/api/auth/signup", requestOptions)
        .then(response => response.json())
        .then(result => onCreatedUser(result))
        .catch(error => console.log('error', error));
    } else {
      alert('password and confirm password should be same.')
    }
  };

  const roles = [{key: 'tokenist', value: 'Tokenist'}, {key: 'staff', value: 'Staff'}];

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <form onSubmit={handleSubmit}>
        <CardHeader title="Profile"/>
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
                helperText="Please specify name"
                label="Name"
                name="name"
                onChange={handleChange}
                required
                value={values.name}
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
                label="Username"
                name="username"
                onChange={handleChange}
                required
                value={values.username}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                onChange={handleChange}
                required
                type="email"
                value={values.email}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Select Role"
                name="role"
                onChange={handleChange}
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{native: true}}
                value={values.role}
                variant="outlined"
              >
                {roles.map(role => (
                  <option
                    key={role.key}
                    value={role.key}
                  >
                    {role.value}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Password"
                name="password"
                onChange={handleChange}
                type="password"
                value={values.password}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Confirm Password"
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
            Submit
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

UserForm.propTypes = {
  className: PropTypes.string,
  profile: PropTypes.object.isRequired
};

export default UserForm;
