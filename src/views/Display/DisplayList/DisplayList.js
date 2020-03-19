import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Page } from 'components';
import { SearchBar } from './components';
import { Header, DisplayTable } from './components';
import {BASE_URL} from "../../../config";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  }
}));

const DisplayList = () => {
  const classes = useStyles();

  const [displays, setDisplays] = useState([]);

  useEffect(() => {
    let mounted = true;

    const fetchDisplays = () => {
      fetch(BASE_URL + "/api/displays/")
        .then(response => response.json())
        .then(displays => {
          if (mounted) {
            setDisplays(displays);
          }
        })
        .catch(error => console.log('error', error));
    };

    fetchDisplays();

    return () => {
      mounted = false;
    };
  }, []);

  const handleFilter = () => {};
  const handleSearch = () => {};

  return (
    <Page
      className={classes.root}
      title="Customer Management List"
    >
      <Header />
      <SearchBar
        onFilter={handleFilter}
        onSearch={handleSearch}
      />
      {displays && (
        <DisplayTable
          className={classes.results}
          displays={displays}
        />
      )}
    </Page>
  );
};

export default DisplayList;
