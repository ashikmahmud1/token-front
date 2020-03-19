import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Divider,
  TextField,
  colors, Typography, FormControlLabel, Checkbox
} from '@material-ui/core';
import {BASE_URL} from "../../../../../config";
import useRouter from 'utils/useRouter';
import SuccessSnackbar from '../SuccessSnackbar';

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

const TokenForm = props => {
  const {profile, className, ...rest} = props;
  const [customers, setCustomers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const router = useRouter();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const classes = useStyles();
  const [values, setValues] = useState({
    customer_id: profile.customer_id,
    department_id: profile.department_id,
    priority: false,
    status: "TOKEN_CREATED"
  });


  // Here load the customer by customer number
  // load all the departments
  useEffect(() => {
    let mounted = true;

    const fetchCustomers = () => {
      fetch(BASE_URL + "/api/customers/")
        .then(response => response.json())
        .then(customers => {
          if (mounted) {
            setCustomers(customers);
          }
        })
        .catch(error => console.log('error', error));
    };
    const fetchDepartments = () => {
      fetch(BASE_URL + "/api/departments/")
        .then(response => response.json())
        .then(departments => {
          if (mounted) {
            setDepartments(departments);
          }
        })
        .catch(error => console.log('error', error));
    };

    fetchCustomers();
    fetchDepartments();

    return () => {
      mounted = false;
    };
  }, []);

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

  const onCreatedToken = (token) => {
    console.log(token);
    // show the snackbar
    setOpenSnackbar(true);
    // redirect to the token list page
    // setTimeout(() => {
    //   router.history.push('/token-list');
    // }, 1000);
  };
  const onChangeCustomer = (event, customer) => {
    setValues({...values, customer_id: customer.id})
  };
  const handleSubmit = event => {
    event.preventDefault();
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");


    let data = JSON.stringify(values);

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: data
    };

    fetch(BASE_URL + "/api/tokens/", requestOptions)
      .then(response => response.json())
      .then(result => onCreatedToken(result))
      .catch(error => console.log('error', error));
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <form onSubmit={handleSubmit}>
        <CardHeader title="Token"/>
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
              <Autocomplete
                id="country-select-demo"
                options={customers}
                classes={{
                  option: classes.option,
                }}
                autoHighlight
                getOptionLabel={option => option.number}
                onChange={onChangeCustomer}
                renderOption={option => (
                  <React.Fragment>
                    <div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
                      <span>{option.number}</span>
                      <span>{option.name}</span>
                    </div>

                  </React.Fragment>
                )}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Select Customer"
                    variant="outlined"
                    required
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'off',
                    }}
                  />
                )}
              />
            </Grid>
            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                fullWidth
                label="Select Department"
                name="department_id"
                onChange={handleChange}
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{native: true}}
                value={values.department_id}
                required
                variant="outlined"
              >
                <option value="">{}</option>
                {departments.map(department => (
                  <option
                    key={department.id}
                    value={department.id}
                  >
                    {department.name}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid
              item
              md={12}
              xs={12}
            >
              <div className={classes.options}>
                <Typography
                  component="h2"
                  gutterBottom
                  variant="overline"
                >
                  Select Priority
                </Typography>

                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={handleChange}
                      name="priority"
                      color="primary"
                      defaultChecked={false}
                    />
                  }
                  label="Priority"
                />
              </div>
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
        <SuccessSnackbar
          onClose={handleSnackbarClose}
          open={openSnackbar}
        />
      </form>
    </Card>
  );
};

TokenForm.propTypes = {
  className: PropTypes.string,
  profile: PropTypes.object.isRequired
};

export default TokenForm;
