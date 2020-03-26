import React from 'react';
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
  const {profile, className, handleSubmit, handleChange, onChangeDepartmentSelection, ...rest} = props;

  const classes = useStyles();

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
                value={profile.name}
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
                value={profile.from_queue}
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
                value={profile.to_queue}
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
                            checked={!!profile.selected_departments.find(id => id === dept.id)}
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
            Save Changes
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

DisplayForm.propTypes = {
  className: PropTypes.string,
  profile: PropTypes.object.isRequired,
  onChangeDepartmentSelection: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
};

export default DisplayForm;
