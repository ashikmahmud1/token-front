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
  TableCell, Radio, Typography, TextField, Grid, FormControlLabel, Checkbox,
} from '@material-ui/core';
import Box from "@material-ui/core/Box";

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
  const {
    customer, type, disableInputs,
    otherText, NOT_PRESENT, className, onStop,
    onNext, onReCall, onChangeType, onChangeText, ...rest
  } = props;

  const classes = useStyles();

  const options = [
    {
      value: 'type1'
    },
    {
      value: 'type2'
    },
    {
      value: 'type3'
    },
    {
      value: 'type4'
    },
    {
      value: 'type5'
    },
    {
      value: 'other'
    }
  ];


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
              <TableCell/>
            </TableRow>
            <TableRow>
              <TableCell>Department Name</TableCell>
              <TableCell>{customer.department ? customer.department.name : ""}</TableCell>
              <TableCell/>
            </TableRow>
            <TableRow selected>
              <TableCell>Current Token</TableCell>
              <TableCell>{customer.token ? customer.token.token_number : ""}</TableCell>
              <TableCell/>
            </TableRow>
            <TableRow selected>
              <TableCell>
                <Box display="flex" flexDirection="column">
                  <TextField
                    disabled={disableInputs.type}
                    fullWidth
                    label="Select Type"
                    name="type"
                    onChange={onChangeText}
                    select
                    // eslint-disable-next-line react/jsx-sort-props
                    SelectProps={{native: true}}
                    value={type}
                    variant="outlined"
                  >
                    {options.map(option => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.value}
                      </option>
                    ))}
                  </TextField>

                  {
                    (type === 'other') && (
                      <TextField
                        style={{marginTop: 20}}
                        fullWidth
                        label="Enter type"
                        name="otherText"
                        onChange={onChangeText}
                        value={otherText}
                        variant="outlined"
                      />
                    )
                  }
                </Box>
              </TableCell>
              <TableCell/>
              <TableCell/>
            </TableRow>
            <TableRow selected>
              <TableCell>NOT PRESENT</TableCell>
              <TableCell>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(event) => onChangeText(event)}
                      name='NOT_PRESENT'
                      color="primary"
                      checked={NOT_PRESENT}
                    />
                  }
                  label=''
                />
              </TableCell>
              <TableCell/>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <CardActions className={classes.actions}>
        <Button
          color="primary"
          size="small"
          disabled={disableInputs.recall}
          onClick={() => onReCall()}
          variant="contained"
        >
          Re-call
        </Button>
        <Button
          style={{marginLeft: 10, backgroundColor: "#ef6c00", color: "#fff"}}
          size="small"
          disabled={disableInputs.next}
          onClick={() => onNext()}
          variant="contained"
        >
          Next
        </Button>
        <Button
          style={{marginLeft: 10, backgroundColor: "#d32f2f", color: "#fff"}}
          size="small"
          disabled={disableInputs.stop}
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
  onNext: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  NOT_PRESENT: PropTypes.bool.isRequired,
  otherText: PropTypes.string.isRequired,
  onChangeType: PropTypes.func.isRequired,
  onChangeText: PropTypes.func.isRequired,
  disableInputs: PropTypes.object.isRequired
};

export default TokenInfo;
