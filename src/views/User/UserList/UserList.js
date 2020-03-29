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

const UserList = () => {
  const classes = useStyles();

  const [users, setUsers] = useState([]);
  const [filterUsers, setFilterUsers] = useState([]);

  useEffect(() => {
    let mounted = true;

    const fetchUsers = () => {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders = addAuthorization(myHeaders);

      let requestOptions = {
        method: 'GET',
        headers: myHeaders
      };
      fetch(BASE_URL + "/api/users/", requestOptions)
        .then(response => response.json())
        .then(users => {
          if (mounted) {
            if (!users.status){
              setUsers(users);
              setFilterUsers(users);
            }
          }
        })
        .catch(error => console.log('error', error));
    };

    fetchUsers();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSearch = (event) => {
    const filter_array = search(users, ['name', 'username', 'email'], event.target.value);
    setFilterUsers(filter_array);
  };

  return (
    <Page
      className={classes.root}
      title="User Management List"
    >
      <Header/>
      <SearchBar
        onSearch={handleSearch}
      />
      {users && (
        <UserTable
          className={classes.results}
          users={filterUsers}
        />
      )}
    </Page>
  );
};

export default UserList;
