import React from 'react';
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
  const {profile, className, handleSubmit, handleChange, onChangeDepartmentColor, ...rest} = props;
  const classes = useStyles();
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
                value={profile.name}
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
                value={profile.letter}
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
                value={profile.start_number}
                type="number"
                InputProps={{ inputProps: { min: 1 } }}
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
                value={dept_colors.find(d => d.key === profile.color) || {}}
                getOptionLabel={option => option.value || ''}
                renderOption={option => (
                  <div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}
                       onClick={() => onChangeDepartmentColor(option)}>
                    <span>{option.value}</span>
                    <span style={{
                      width: 20,
                      height: 20,
                      borderRadius: 20,
                      backgroundColor: option.key,
                    }}/>
                  </div>
                )}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Select Color"
                    variant="outlined"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'off',
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
            Save Changes
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

DepartmentForm.propTypes = {
  className: PropTypes.string,
  profile: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onChangeDepartmentColor: PropTypes.func.isRequired,
};

export default DepartmentForm;
