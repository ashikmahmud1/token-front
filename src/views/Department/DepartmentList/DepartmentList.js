import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/styles';

import {Page} from 'components';
import {SearchBar} from './components';
import {Header, DepartmentTable} from './components';
import {BASE_URL} from "../../../config";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  }
}));

// CONVERT THIS TO CLASS BASED COMPONENT
// SUBSCRIBE TO THE SOCKET CHANNEL
const DepartmentList = () => {
  const classes = useStyles();

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    let mounted = true;

    const fetchDepartments = () => {
      fetch(BASE_URL + "/api/departments/")
        .then(response => response.json())
        .then(departments => {
          if (mounted) {
            setDepartments(departments);
          }
        })
        .catch(error => console.log('error', error));
    };

    fetchDepartments();

    return () => {
      mounted = false;
    };
  }, []);

  const handleFilter = () => {
  };
  const handleSearch = () => {
  };

  const filterDepartment = id => {
    let filter_departments = departments.filter(d => parseInt(d.id) !== parseInt(id));
    setDepartments(filter_departments);
  };
  const deleteDepartment = id => {
    let requestOptions = {
      method: 'DELETE'
    };

    if (window.confirm("Are you sure to delete?")) {
      fetch(BASE_URL + "/api/departments/" + id, requestOptions)
        .then(response => response.json())
        .then(result => filterDepartment(id))
        .catch(error => console.log('error', error));
    }
  };

  const resetDepartment = id => {
    if (window.confirm("Are you sure to reset?")) {
      console.log(id);
    }
  };

  return (
    <Page
      className={classes.root}
      title="Department Management List"
    >
      <Header/>
      <SearchBar
        onFilter={handleFilter}
        onSearch={handleSearch}
      />
      {departments.length > 0 && (
        <DepartmentTable
          deleteDepartment={deleteDepartment}
          resetDepartment={resetDepartment}
          className={classes.results}
          departments={departments}
        />
      )}
    </Page>
  );
};

export default DepartmentList;
