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

  const filterDisplay = (id) => {
    let filter_displays = displays.filter(d => parseInt(d.id) !== parseInt(id));
    setDisplays(filter_displays);
    setFilterDisplays(filter_displays);
  };
  const deleteDisplay = id => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders = addAuthorization(myHeaders);

    let requestOptions = {
      method: 'DELETE',
      headers: myHeaders
    };

    if (window.confirm("Are you sure to delete?")) {
      fetch(BASE_URL + "/api/displays/" + id, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result);
          if (!result.status){
            filterDisplay(id)
          }
        })
        .catch(error => console.log('error', error));
    }
  };

  return (
    <Page
      className={classes.root}
      title="Display Management List"
    >
      <Header/>
      <SearchBar
        onSearch={handleSearch}
      />
      {displays && (
        <DisplayTable
          className={classes.results}
          displays={filterDisplays}
          deleteDisplay={deleteDisplay}
        />
      )}
    </Page>
  );
};

export default DisplayList;
