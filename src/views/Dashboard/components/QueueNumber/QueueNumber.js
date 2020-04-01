import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/styles';
import {generateBrighterColor} from "utils/functions";
import Box from "@material-ui/core/Box";
import PersonAddIcon from '@material-ui/icons/PersonAdd';

const useStyles = makeStyles(() => ({
  root: {},
  card: {
    width: 300
  },
  queueTable: {
    width: '100%'
  }
}));

const QueueColumn = props => {
  const {departmentTokens, totalItems} = props;
  const {department, tokens} = departmentTokens;

  let count = 0;
  // count only the tokens which status is TOKEN_CREATED
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].status === 'TOKEN_CREATED')
      count++;
  }
  const classes = useStyles();

  return (
    <Box m={1} width={totalItems > 0 ? 1 / totalItems : 'auto'} className={classes.root}>
      <Box m={1}>
        <h1 style={{backgroundColor: generateBrighterColor(department.color, 60), textAlign: 'center'}}>
          {department.name}
        </h1>
        {/*  Design the BOX */}
        <Box display="flex" flexDirection='column' justifyContent='center' alignItems='center'
             style={{backgroundColor: department.color, height: 150}}>
          <div style={{position: "relative", left: -25, fontSize: 22}}>
            <PersonAddIcon/>
            <span style={{position: "absolute", marginLeft: 5, top: 0}}>Queue</span>
          </div>
          <h1>{count}</h1>
        </Box>
      </Box>
    </Box>
  );
};

QueueColumn.propTypes = {
  departmentTokens: PropTypes.object,
  totalItems: PropTypes.number.isRequired
};

export default QueueColumn;
