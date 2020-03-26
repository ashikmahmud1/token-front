import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/styles';

import axios from 'utils/axios';
import {Page} from 'components';
import {SearchBar} from './components';
import {Header, UserTable} from './components';
import {BASE_URL} from "../../../config";
import {search} from "utils/functions";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  }
}));

const CustomerList = () => {
  const classes = useStyles();

  const [customers, setCustomers] = useState([]);
  const [filterCustomers, setFilterCustomers] = useState([]);

  useEffect(() => {
    let mounted = true;

    const fetchCustomers = () => {
      fetch(BASE_URL + "/api/customers/")
        .then(response => response.json())
        .then(customers => {
          if (mounted) {
            setCustomers(customers);
            setFilterCustomers(customers);
          }
        })
        .catch(error => console.log('error', error));
    };

    fetchCustomers();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSearch = (event) => {
    const filter_array = search(customers, ['name', 'number', 'contact'], event.target.value);
    setFilterCustomers(filter_array);
  };

  return (
    <Page
      className={classes.root}
      title="Customer Management List"
    >
      <Header/>
      <SearchBar
        onSearch={handleSearch}
      />
      {customers && (
        <UserTable
          className={classes.results}
          customers={filterCustomers}
        />
      )}
    </Page>
  );
};

export default CustomerList;
