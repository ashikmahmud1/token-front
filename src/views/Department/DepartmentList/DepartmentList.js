import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/styles';

import {Page} from 'components';
import {SearchBar} from './components';
import {Header, DepartmentTable} from './components';
import {BASE_URL} from "../../../config";
import SocketConnection from "../../../components/SocketConnection";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  }
}));

const DepartmentList = () => {
  const classes = useStyles();

  const [departments, setDepartments] = useState([]);
  const [departmentTokens, setDepartmentTokens] = useState({});

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
  const onTokenCreated = (departmentTokens) => {
    if (departmentTokens)
      setDepartmentTokens(departmentTokens);
  };

  const onTokenServed = (departmentTokens) => {
    if (departmentTokens)
      setDepartmentTokens(departmentTokens);
  };

  const onTokenCalled = (departmentTokens, message) => {
    console.log(message);
    if (departmentTokens)
      setDepartmentTokens(departmentTokens);
  };

  const onTokenDeleted = (departmentTokens) => {
    if (departmentTokens)
      setDepartmentTokens(departmentTokens);
  };

  const onTokenReset = (departmentTokens) => {
    if (departmentTokens)
      setDepartmentTokens(departmentTokens);
  };

  const onSetTokens = (departmentTokens) => {
    setDepartmentTokens(departmentTokens);
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

  const setResetDepartment = department => {
    let new_departments = [...departments];
    let reset_department_index = departments.findIndex(d => d.id === department.id);
    if (reset_department_index !== -1) {
      new_departments[reset_department_index] = department;
      setDepartments(new_departments);
    }
  };
  const resetDepartment = id => {
    if (window.confirm("Are you sure to reset?")) {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      let tokens = departmentTokens[id].tokens || [];
      tokens.forEach(token => {
        token.serving_end = token.status === 'TOKEN_CALLED' ? new Date() : token.serving_end;
        token.status = token.status === 'TOKEN_CALLED' ? 'TOKEN_SERVED' : 'TOKEN_NOT_CAME';
      });

      let data = JSON.stringify({tokens});

      let requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: data
      };

      fetch(BASE_URL + "/api/departments/reset/" + id, requestOptions)
        .then(response => response.json())
        .then(result => setResetDepartment(result))
        .catch(error => console.log('error', error));
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
      <SocketConnection
        onTokenCreated={onTokenCreated}
        onTokenServed={onTokenServed}
        onTokenCalled={onTokenCalled}
        onTokenDeleted={onTokenDeleted}
        onTokenReset={onTokenReset}
        onSetTokens={onSetTokens}/>
    </Page>
  );
};

export default DepartmentList;
