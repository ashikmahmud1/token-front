import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/styles';

import {Page} from 'components';
import {SearchBar} from './components';
import {Header, UserTable} from './components';
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

  const filterCustomer = (id) => {
    let filter_customers = customers.filter(d => parseInt(d.id) !== parseInt(id));
    setCustomers(filter_customers);
    setFilterCustomers(filter_customers);
  };
  const deleteCustomer = id => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders = addAuthorization(myHeaders);

    let requestOptions = {
      method: 'DELETE',
      headers: myHeaders
    };

    if (window.confirm("Are you sure to delete?")) {
      fetch(BASE_URL + "/api/customers/" + id, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result);
          if (!result.status){
            filterCustomer(id)
          }
        })
        .catch(error => console.log('error', error));
    }
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
          deleteCustomer={deleteCustomer}
        />
      )}
    </Page>
  );
};

export default CustomerList;
