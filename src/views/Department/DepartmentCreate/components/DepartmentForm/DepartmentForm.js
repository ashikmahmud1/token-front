import React, {useState} from 'react';
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
  colors
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

const DepartmentForm = props => {
  const {profile, className, ...rest} = props;
  const router = useRouter();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const classes = useStyles();
  const [values, setValues] = useState({
    name: profile.name,
    letter: profile.letter,
    start_number: profile.start_number,
    color: profile.color
  });

  const dept_colors = [
    {key: '#6a1b9a', value: 'Purple'},
    {key: '#4527a0', value: 'Deep Purple'},
    {key: '#283593', value: 'Indigo'},
    {key: '#1565c0', value: 'Blue'},
    {key: '#0277bd', value: 'Light Blue'},
    {key: '#00838f', value: 'Cyan'},
    {key: '#00695c', value: 'Teal'},
    {key: '#ef6c00', value: 'Amber'},
  ];

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

  const onCreatedDepartment = (department) => {
    console.log(department);
    // show the snackbar
    setOpenSnackbar(true);
    // redirect to the department list page
    setTimeout(() => {
      router.history.push('/department/list');
    }, 1000);
  };
  const onChangeDepartmentColor = (color) => {
    console.log(color);
    setValues({...values, color: color.key});
  };
  const handleSubmit = event => {
    event.preventDefault();
    console.log(values);
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");


    let data = JSON.stringify(values);

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: data
    };

    fetch(BASE_URL + "/api/departments/", requestOptions)
      .then(response => response.json())
      .then(result => onCreatedDepartment(result))
      .catch(error => console.log('error', error));
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <form onSubmit={handleSubmit}>
        <CardHeader title="Department"/>
        <Divider/>
        <CardContent>
          <Grid
            container
            spacing={4}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                helperText="Please specify department name"
                label="Department Name"
                name="name"
                onChange={handleChange}
                required
                value={values.name}
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
                label="Department Letter"
                name="letter"
                onChange={handleChange}
                required
                value={values.letter}
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
                label="Start Number"
                name="start_number"
                onChange={handleChange}
                value={values.age}
                type="number"
                required
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <Autocomplete
                id="country-select-demo"
                options={dept_colors}
                classes={{
                  option: classes.option,
                }}
                autoHighlight
                getOptionLabel={option => option.value}
                renderOption={option => (
                  <React.Fragment>
                    <div style={{display: 'flex', width:'100%', justifyContent:'space-between'}} onClick={() => onChangeDepartmentColor(option)}>
                      <span>{option.value}</span>
                      <span style={{
                        width: 20,
                        height: 20,
                        borderRadius: 20,
                        backgroundColor: option.key,
                      }}/>
                    </div>

                  </React.Fragment>
                )}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Select Color"
                    variant="outlined"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password',
                    }}
                  />
                )}
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

DepartmentForm.propTypes = {
  className: PropTypes.string,
  profile: PropTypes.object.isRequired
};

export default DepartmentForm;
