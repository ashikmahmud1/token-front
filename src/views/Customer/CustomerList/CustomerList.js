import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/styles';

import axios from 'utils/axios';
import {Page} from 'components';
import {SearchBar} from './components';
import {Header, UserTable} from './components';
import {BASE_URL} from "../../../config";

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

  useEffect(() => {
    let mounted = true;

    const fetchCustomers = () => {
      fetch(BASE_URL + "/api/customers/")
        .then(response => response.json())
        .then(customers => {
          if (mounted) {
            setCustomers(customers);
          }
        })
        .catch(error => console.log('error', error));
    };

    fetchCustomers();

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
      title="Customer Management List"
    >
      <Header/>
      <SearchBar
        onFilter={handleFilter}
        onSearch={handleSearch}
      />
      {customers && (
        <UserTable
          className={classes.results}
          customers={customers}
        />
      )}
    </Page>
  );
};

export default CustomerList;
