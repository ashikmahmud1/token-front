import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Button, Card, Grid} from '@material-ui/core';

import axios from 'utils/axios';
import { ProfileDetails, GeneralSettings } from './components';

const useStyles = makeStyles(() => ({
  root: {}
}));

const General = props => {
  const { className, ...rest } = props;

  const classes = useStyles();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (localStorage.getItem('token_user')){
      setProfile(JSON.parse(localStorage.getItem('token_user')))
    }
  }, []);

  if (!profile) {
    return null;
  }

  return (
    <Grid
      {...rest}
      className={clsx(classes.root, className)}
      container
      spacing={3}
    >
      <Grid
        item
        lg={12}
        md={12}
        xl={12}
        xs={12}
      >
        <ProfileDetails profile={profile} />
      </Grid>
      <Grid
        item
        lg={12}
        md={12}
        xl={12}
        xs={12}
      >
        <GeneralSettings profile={profile} />
      </Grid>
    </Grid>
  );
};

General.propTypes = {
  className: PropTypes.string
};

export default General;
