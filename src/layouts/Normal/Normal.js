import React, {Fragment, Suspense} from 'react';
import { renderRoutes } from 'react-router-config';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { LinearProgress } from '@material-ui/core';
import { Topbar } from './components';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  }
}));

const Normal = props => {
  // eslint-disable-next-line react/prop-types
  const { route } = props;

  const classes = useStyles();

  return (
    <Fragment>
      <Topbar />
      <main className={classes.root}>
        <Suspense fallback={<LinearProgress />}>
          {/* eslint-disable-next-line react/prop-types */}
          {renderRoutes(route.routes)}
        </Suspense>
      </main>
    </Fragment>
  );
};

Error.propTypes = {
  route: PropTypes.object
};

export default Normal;
