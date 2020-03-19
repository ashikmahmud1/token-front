import {makeStyles} from "@material-ui/styles";
import React, {useEffect, useState} from "react";
import Header from "./components/Header";
import Page from "components/Page";
import DepartmentForm from "./components/DepartmentForm";
import useRouter from 'utils/useRouter';
import {BASE_URL} from "../../../config";
import SuccessSnackbar from "./components/SuccessSnackbar";

const useStyles = makeStyles(theme => ({
  root: {
    width: theme.breakpoints.values.lg,
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3, 3, 6, 3)
  },
  userForm: {
    marginTop: theme.spacing(3)
  },
}));

const DepartmentEdit = () => {
  const classes = useStyles();
  const router = useRouter();
  const [id, setId] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    letter: '',
    start_number: '',
    color: ''
  });

  const handleChange = event => {
    event.persist();

    setProfile({
      ...profile,
      [event.target.name]:
        event.target.type === 'checkbox'
          ? event.target.checked
          : event.target.value
    });
  };
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const onEditedDepartment = (department) => {
    // show the snackbar
    setOpenSnackbar(true);
    // redirect to the department list page
    setTimeout(() => {
      router.history.push('/department/list');
    }, 1000);
  };
  const onChangeDepartmentColor = (color) => {
    setProfile({...profile, color: color.key});
  };
  const handleSubmit = event => {
    event.preventDefault();
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");


    let data = JSON.stringify(profile);

    let requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: data
    };

    fetch(BASE_URL + "/api/departments/" + id, requestOptions)
      .then(response => response.json())
      .then(result => onEditedDepartment(result))
      .catch(error => console.log('error', error));
  };
  useEffect(() => {
    let mounted = true;
    // get the id from the router

    setId(router.match.params.id);

    const fetchDepartment = () => {
      fetch(BASE_URL + "/api/departments/" + router.match.params.id)
        .then(response => response.json())
        .then(result => {
          if (mounted) setProfile(result)
        })
        .catch(error => console.log('error', error));
    };

    fetchDepartment();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Page
      className={classes.root}
      title="Department Edit"
    >
      <Header/>
      <DepartmentForm
        profile={profile}
        className={classes.userForm}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        onChangeDepartmentColor={onChangeDepartmentColor}/>
      <SuccessSnackbar
        onClose={handleSnackbarClose}
        open={openSnackbar}
      />
    </Page>
  )
};

export default DepartmentEdit;
