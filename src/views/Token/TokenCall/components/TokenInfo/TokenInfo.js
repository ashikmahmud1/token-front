import React, {useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Divider,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    '& > * + *': {
      marginLeft: 20
    }
  },
  buttonIcon: {
    marginRight: theme.spacing(1)
  }
}));

const TokenInfo = props => {
  const {customer, className, onStop, onNext, onReCall, ...rest} = props;

  const classes = useStyles();


  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader title="Token info"/>
      <Divider/>
      <CardContent className={classes.content}>
        <Table>
          <TableBody>
            <TableRow selected>
              <TableCell>Counter No</TableCell>
              <TableCell>{customer.counter ? customer.counter.letter : ""}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Department Name</TableCell>
              <TableCell>{customer.department ? customer.department.name : ""}</TableCell>
            </TableRow>
            <TableRow selected>
              <TableCell>Current Token</TableCell>
              <TableCell>{customer.token ? customer.token.token_number : ""}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <CardActions className={classes.actions}>
        <Button
          color="primary"
          size="small"
          onClick={() => onReCall()}
          variant="contained"
        >
          Re-call
        </Button>
        <Button
          style={{marginLeft: 20, backgroundColor: "#ef6c00", color: "#fff"}}
          size="small"
          onClick={() => onNext()}
          variant="contained"
        >
          Next
        </Button>
        <Button
          style={{marginLeft: 20, backgroundColor: "#d32f2f", color: "#fff"}}
          size="small"
          onClick={() => onStop()}
          variant="contained"
        >
          Stop
        </Button>
      </CardActions>
    </Card>
  );
};

TokenInfo.propTypes = {
  className: PropTypes.string,
  customer: PropTypes.object.isRequired,
  onReCall: PropTypes.func.isRequired,
  onStop: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired
};

export default TokenInfo;
