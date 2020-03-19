import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/styles';

import {Page} from 'components';
import {SearchBar} from './components';
import {Header, CounterTable} from './components';
import {BASE_URL} from "../../../config";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  }
}));

const CounterList = () => {
  const classes = useStyles();

  const [counters, setCounters] = useState([]);

  useEffect(() => {
    let mounted = true;

    const fetchCounters = () => {
      fetch(BASE_URL + "/api/counters/")
        .then(response => response.json())
        .then(counters => {
          if (mounted) {
            setCounters(counters);
          }
        })
        .catch(error => console.log('error', error));
    };

    fetchCounters();

    return () => {
      mounted = false;
    };
  }, []);

  const handleFilter = () => {
  };
  const handleSearch = () => {
  };

  return (
    <Page
      className={classes.root}
      title="Counter List"
    >
      <Header/>
      <SearchBar
        onFilter={handleFilter}
        onSearch={handleSearch}
      />
      {counters && (
        <CounterTable
          className={classes.results}
          counters={counters}
        />
      )}
    </Page>
  );
};

export default CounterList;
