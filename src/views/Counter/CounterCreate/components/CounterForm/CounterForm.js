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
import {BASE_URL} from "../../../../../config";
import useRouter from 'utils/useRouter';
import SuccessSnackbar from '../SuccessSnackbar';
import {addAuthorization} from "../../../../../utils/functions";

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

const CounterForm = props => {
  const {profile, className, ...rest} = props;
  const router = useRouter();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const classes = useStyles();
  const [values, setValues] = useState({
    name: profile.name,
    letter: profile.letter,
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
    myHeaders = addAuthorization(myHeaders);

    let data = JSON.stringify(values);

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: data
    };

    fetch(BASE_URL + "/api/counters/", requestOptions)
      .then(response => response.json())
      .then(result => onCreatedCounter(result))
      .catch(error => console.log('error', error));
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <form onSubmit={handleSubmit}>
        <CardHeader title="Counter"/>
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
                helperText="Please specify the counter name"
                label="Counter Name"
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
                helperText="Please specify the counter letter"
                label="Counter Letter"
                name="letter"
                onChange={handleChange}
                required
                value={values.letter}
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
    </Card>
  );
};

CounterForm.propTypes = {
  className: PropTypes.string,
  profile: PropTypes.object.isRequired
};

export default CounterForm;
