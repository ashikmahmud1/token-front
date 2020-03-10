import React from 'react';
import {Link as RouterLink} from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/styles';
import {AppBar, IconButton, Toolbar} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    boxShadow: 'none'
  },
  flexGrow: {
    flexGrow: 1
  },
}));

const FullScreenIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg"
       width="27"
       fill={props.fill}
       height="27"
       viewBox="0 0 18 18">
    <path
      d="M4.5 11H3v4h4v-1.5H4.5V11zM3 7h1.5V4.5H7V3H3v4zm10.5 6.5H11V15h4v-4h-1.5v2.5zM11 3v1.5h2.5V7H15V3h-4z"/>
  </svg>
);

const Topbar = props => {
  const {className, ...rest} = props;

  const classes = useStyles();

  const onToggleFullScreen = () => {
    console.log('Toggle full screen');
  };

  return (
    <AppBar
      {...rest}
      className={clsx(classes.root, className)}
      color="primary"
    >
      <Toolbar>
        <RouterLink to="/">
          <img
            alt="Logo"
            src="/images/logos/logo--white.svg"
          />
        </RouterLink>
        <div className={classes.flexGrow}/>
        <IconButton
          color="default"
          onClick={() => onToggleFullScreen()}
        >
          <FullScreenIcon fill="white"/>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string
};

export default Topbar;
