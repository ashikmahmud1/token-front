import React, {useEffect, useRef, useState} from 'react';
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
import SuccessSnackbar from '../SuccessSnackbar';
import moment from 'moment';
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

const TokenForm = props => {

  const {profile, className, ...rest} = props;
  const [customers, setCustomers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [values, setValues] = useState({
    customer_id: profile.customer_id,
    department_id: profile.department_id,
    priority: false,
    status: profile.status
  });
  const myRef = useRef(React.createRef());
  const errors = {
    403: "you don't have permission",
    401: "Unauthorized",
    404: "Not found",
    500: "Internal server error"
  };

  const classes = useStyles();

  const handleErrorClose = () => {
    setOpenError(false);
  };


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
    // pop up the print option
    myRef.current.innerHTML = `<div style=text-align:center>
                                <h2>Department Name : ${token.department.name}</h2>
                                <h1>Token Number : ${token.token_number} ${token.priority ? '(P)' : ''}</h1>
                                <h4>Customer Number : ${token.customer.number}</h4>
                                <span>${moment(token.updatedAt).format('MMMM Do YYYY, h:mm:ss a')}</span>
                              </div>`;
    let contents = myRef.current.innerHTML;
    let frame1 = document.createElement('iframe');
    frame1.name = "frame1";
    // frame1.style.position = "absolute";
    frame1.style.top = "-1000000px";
    document.body.appendChild(frame1);
    let frameDoc = frame1.contentWindow ? frame1.contentWindow : frame1.contentDocument.document ? frame1.contentDocument.document : frame1.contentDocument;
    frameDoc.document.open();
    frameDoc.document.write('<html style=""><head><title>Token</title>');
    frameDoc.document.write('</head><body>');
    frameDoc.document.write(contents);
    frameDoc.document.write('</body></html>');
    frameDoc.document.close();
    setTimeout(function () {
      window.frames["frame1"].focus();
      window.frames["frame1"].print();
      document.body.removeChild(frame1);
    }, 500);
  };
  const onChangeCustomer = (event, customer) => {
    if (customer)
      setValues({...values, customer_id: customer.id})
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

    fetch(BASE_URL + "/api/tokens/", requestOptions)
      .then(response => response.json())
      .then(result => {
        if (!result.message) {
          setValues({...values, priority: false, customer_id: profile.customer_id});
          onCreatedToken(result);
        } else {
          setOpenError(true);
          setErrorMessage(errors[result.status])
        }
      })
      .catch(error => console.log('error', error));
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      {/*  Here add a hidden tag which will print when display */}
      <div ref={myRef} style={{border: "1px dotted black; padding: 5px", display: "none"}}/>
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
                id="select-customer"
                options={customers}
                classes={{
                  option: classes.option,
                }}
                autoHighlight
                getOptionLabel={option => option.number || ''}
                value={customers.find(c => c.id === values.customer_id) || {}}
                onChange={onChangeCustomer}
                renderOption={option => (
                  <div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
                    <span>{option.number}</span>
                    <span>{option.name}</span>
                  </div>
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
                      checked={values.priority}
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
        <ErrorSnackbar
          message={errorMessage}
          onClose={handleErrorClose}
          open={openError}/>
      </form>
    </Card>
  );
};

TokenForm.propTypes = {
  className: PropTypes.string,
  profile: PropTypes.object.isRequired,
};

export default TokenForm;
