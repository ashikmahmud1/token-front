import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/styles';
import {Page} from 'components';
import {SearchBar} from './components';
import {Header, DisplayTable} from './components';
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

const DisplayList = () => {
  const classes = useStyles();

  const [displays, setDisplays] = useState([]);
  const [filterDisplays, setFilterDisplays] = useState([]);

  useEffect(() => {
    let mounted = true;

    const fetchDisplays = () => {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders = addAuthorization(myHeaders);

      let requestOptions = {
        method: 'GET',
        headers: myHeaders
      };
      fetch(BASE_URL + "/api/displays/",requestOptions)
        .then(response => response.json())
        .then(displays => {
          if (mounted) {
            setDisplays(displays);
            setFilterDisplays(displays);
          }
        })
        .catch(error => console.log('error', error));
    };

    fetchDisplays();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSearch = (event) => {
    const filter_array = search(displays, ['name'], event.target.value);
    setFilterDisplays(filter_array);
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
      {displays && (
        <DisplayTable
          className={classes.results}
          displays={filterDisplays}
        />
      )}
    </Page>
  );
};

export default DisplayList;
