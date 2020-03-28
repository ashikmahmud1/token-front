import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/styles';

import {Page} from 'components';
import {Header, DepartmentTable} from './components';
import {BASE_URL} from "../../../config";
import TextField from "@material-ui/core/TextField";
import {Button} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  },
  saveButton: {
    marginTop: 10,
    marginLeft: 10
  }
}));

const OverallReportList = () => {
  const classes = useStyles();
  const [tokens, setTokens] = useState([]);
  const [filterTokens, setFilterTokens] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    let mounted = true;

    // get all the tokens
    const fetchTokens = () => {
      fetch(BASE_URL + "/api/tokens/")
        .then(response => response.json())
        .then(tokens => {
          if (mounted) {
            setTokens(tokens);
            setFilterTokens(tokens);
          }
        })
        .catch(error => console.log('error', error));
    };

    fetchTokens();

    return () => {
      mounted = false;
    };
  }, []);

  const filter = () => {
    // check if fromDate is '' or not
    let filter_tokens = [...tokens];
    if (fromDate !== '') {
      filter_tokens = tokens.filter(t => new Date(t.createdAt) >= new Date(fromDate));
    }
    if (toDate !== ''){
      filter_tokens = tokens.filter(t => new Date(t.createdAt) <= new Date(toDate));
    }
    setFilterTokens(filter_tokens);
  };

  return (
    <Page
      className={classes.root}
      title="Overall Report"
    >
      <Header/>
      <TextField
        id="date"
        label="From Date"
        type="date"
        value={fromDate}
        className={classes.textField}
        onChange={event => setFromDate(event.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        id="date"
        label="To Date"
        type="date"
        value={toDate}
        style={{marginLeft: 20}}
        className={classes.textField}
        onChange={event => setToDate(event.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <Button
        className={classes.saveButton}
        onClick={() => filter()}
        color='primary'
        type="submit"
        variant="contained"
      >
        GO
      </Button>
      {tokens.length > 0 && (
        <DepartmentTable
          className={classes.results}
          tokens={filterTokens}
        />
      )}
    </Page>
  );
};

export default OverallReportList;
