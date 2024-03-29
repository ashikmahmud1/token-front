import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/styles';

import {Page} from 'components';
import {SearchBar} from './components';
import {Header, CounterTable} from './components';
import {BASE_URL} from "../../../config";
import {search} from "utils/functions";
import {addAuthorization} from "../../../utils/functions";

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
  const [filterCounters, setFilterCounters] = useState([]);

  useEffect(() => {
    let mounted = true;

    const fetchCounters = () => {
      fetch(BASE_URL + "/api/counters/")
        .then(response => response.json())
        .then(counters => {
          if (mounted) {
            setCounters(counters);
            setFilterCounters(counters);
          }
        })
        .catch(error => console.log('error', error));
    };

    fetchCounters();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSearch = (event) => {
    const filter_array = search(counters, ['name', 'letter'], event.target.value);
    setFilterCounters(filter_array);
  };

  const filterCounter = (id) => {
    let filter_counters = counters.filter(d => parseInt(d.id) !== parseInt(id));
    setCounters(filter_counters);
    setFilterCounters(filter_counters);

    // check if this counter is saved in the localStorage
    if (localStorage.getItem('department_counter')) {
      let department_counter = JSON.parse(localStorage.getItem('department_counter'));
      department_counter.counter_id = id === department_counter.counter_id ? '' : department_counter.counter_id;
      localStorage.setItem('department_counter', JSON.stringify(department_counter));
    }
  };
  const deleteCounter = id => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders = addAuthorization(myHeaders);

    let requestOptions = {
      method: 'DELETE',
      headers: myHeaders
    };

    if (window.confirm("Are you sure to delete?")) {
      fetch(BASE_URL + "/api/counters/" + id, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result);
          if (!result.status){
            filterCounter(id)
          }
        })
        .catch(error => console.log('error', error));
    }
  };

  return (
    <Page
      className={classes.root}
      title="Counter List"
    >
      <Header/>
      <SearchBar
        onSearch={handleSearch}
      />
      {counters && (
        <CounterTable
          className={classes.results}
          counters={filterCounters}
          deleteCounter={deleteCounter}
        />
      )}
    </Page>
  );
};

export default CounterList;
