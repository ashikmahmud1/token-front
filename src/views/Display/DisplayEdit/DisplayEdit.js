import {makeStyles} from "@material-ui/styles";
import React, {useEffect, useState} from "react";
import Header from "./components/Header";
import Page from "components/Page";
import DisplayForm from "./components/DisplayForm";
import {BASE_URL} from "../../../config";
import useRouter from 'utils/useRouter';
import SuccessSnackbar from "./components/SuccessSnackbar";
import {addAuthorization} from "../../../utils/functions";

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

const DisplayCreate = () => {
  const [profile, setProfile] = useState({
    name: '',
    from_queue: '',
    to_queue: '',
    departments: [],
    selected_departments: []
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const classes = useStyles();
  const [id, setId] = useState('');
  const router = useRouter();

  const setDisplay = (display) => {
    let departments = display.departments || [];
    let selected_departments = [];
    departments.forEach((department) => {
      selected_departments.push(department.id);
    });
    return {
      ...profile,
      name: display.name,
      from_queue: display.from_queue,
      to_queue: display.to_queue,
      selected_departments: selected_departments
    };
  };

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

  const onChangeDepartmentSelection = (event, dept_id) => {
    let selected_departments = [...profile.selected_departments];
    if (event.target.checked) {
      selected_departments.push(dept_id);
      setProfile({...profile, selected_departments})
    } else {
      setProfile({...profile, selected_departments: selected_departments.filter(id => id !== dept_id)});
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const onCreatedDisplay = (result) => {
    console.log(result);
    // show the snackbar
    setOpenSnackbar(true);
    // redirect to the display list page
    setTimeout(() => {
      router.history.push('/display/list');
    }, 1000);
  };

  const handleSubmit = event => {
    event.preventDefault();
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders = addAuthorization(myHeaders);

    let data = JSON.stringify({
      name: profile.name,
      departments: profile.selected_departments,
      to_queue: profile.to_queue,
      from_queue: profile.from_queue
    });

    let requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: data
    };

    fetch(BASE_URL + "/api/displays/" + id, requestOptions)
      .then(response => response.json())
      .then(result => onCreatedDisplay(result))
      .catch(error => console.log('error', error));
  };

  const fetchDepartments = (display) => {
    let new_display = setDisplay(display);
    fetch(BASE_URL + "/api/departments/")
      .then(response => response.json())
      .then(result => {
        setProfile({
          ...profile,
          departments: result,
          name: new_display.name,
          from_queue: new_display.from_queue,
          to_queue: new_display.to_queue,
          selected_departments: new_display.selected_departments
        })
      })
      .catch(error => console.log('error', error));
  };

  // get all the departments
  useEffect(() => {
    let mounted = true;
    setId(router.match.params.id);

    const fetchDisplay = () => {
      fetch(BASE_URL + "/api/displays/" + router.match.params.id)
        .then(response => response.json())
        .then(result => {
          if (mounted) {
            fetchDepartments(result);
          }
        })
        .catch(error => console.log('error', error));
    };

    fetchDisplay();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Page
      className={classes.root}
      title="Display Edit"
    >
      <Header/>

      <DisplayForm
        profile={profile}
        className={classes.userForm}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        onChangeDepartmentSelection={onChangeDepartmentSelection}/>

      <SuccessSnackbar
        onClose={handleSnackbarClose}
        open={openSnackbar}
      />
    </Page>
  )
};

export default DisplayCreate;
