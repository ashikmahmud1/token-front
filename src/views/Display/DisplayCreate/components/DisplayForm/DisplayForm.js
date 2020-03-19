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
  Typography,
  colors, FormControlLabel, Checkbox
} from '@material-ui/core';
import {BASE_URL} from "../../../../../config";
import useRouter from 'utils/useRouter';
import SuccessSnackbar from '../SuccessSnackbar';

const useStyles = makeStyles(theme => ({
  root: {},
  options: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column'
  },
  saveButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  }
}));

const DisplayForm = props => {
  const {profile, className, ...rest} = props;
  const router = useRouter();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const classes = useStyles();
  const [values, setValues] = useState({
    name: profile.name,
    departments: profile.departments,
    from_queue: profile.from_queue,
    to_queue: profile.to_queue,
    selected_departments: []
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
  const onChangeDepartmentSelection = (event, dept_id) => {
    let selected_departments = [...values.selected_departments];
    if (event.target.checked) {
      selected_departments.push(dept_id);
      setValues({...values, selected_departments})
    } else {
      setValues({...values, selected_departments: selected_departments.filter(id => id !== dept_id)});
    }
  };

  const onCreatedDisplay = (result) => {
    console.log(result);
    // show the snackbar
    setOpenSnackbar(true);
    // redirect to the display list page
    setTimeout(() => {
      router.history.push('/display/list');
    }, 1000);
  };
  const handleSubmit = event => {
    event.preventDefault();
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let data = JSON.stringify({
      name: values.name,
      departments: values.selected_departments,
      to_queue: values.to_queue,
      from_queue: values.from_queue
    });

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: data
    };

    fetch(BASE_URL + "/api/displays/", requestOptions)
      .then(response => response.json())
      .then(result => onCreatedDisplay(result))
      .catch(error => console.log('error', error));
  };

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
                helperText="Please specify display name"
                label="Display Name"
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
                helperText="Please specify from queue list"
                label="From Queue List"
                name="from_queue"
                onChange={handleChange}
                required
                type="number"
                value={values.from_queue}
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
                helperText="Please specify to queue list"
                label="To Queue List"
                name="to_queue"
                onChange={handleChange}
                required
                type="number"
                value={values.to_queue}
                variant="outlined"
              />
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
                  Select Departments
                </Typography>
                {
                  profile.departments.map(dept => {
                    return (
                      <FormControlLabel
                        key={dept.id}
                        control={
                          <Checkbox
                            onChange={(event) => onChangeDepartmentSelection(event, dept.id)}
                            color="primary"
                            defaultChecked={false}
                          />
                        }
                        label={dept.name}
                      />
                    )
                  })
                }
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
      </form>
      <SuccessSnackbar
        onClose={handleSnackbarClose}
        open={openSnackbar}
      />
    </Card>
  );
};

DisplayForm.propTypes = {
  className: PropTypes.string,
  profile: PropTypes.object.isRequired
};

export default DisplayForm;
