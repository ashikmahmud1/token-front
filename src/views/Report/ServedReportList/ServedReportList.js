import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/styles';

import {Page} from 'components';
import {Header} from './components';
import {BASE_URL} from "../../../config";
import ServedReportTable from "./components/ServedReportTable";
import {addAuthorization} from "../../../utils/functions";
import TextField from "@material-ui/core/TextField";
import {Button} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  },
  saveButton: {
    marginTop: 10,
    marginLeft: 10
  }
}));

const ServedReportList = () => {
  const classes = useStyles();

  const [reportData, setReportData] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const fetchUserReport = () => {
    // post request
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders = addAuthorization(myHeaders);
    let data = JSON.stringify({from_date: fromDate !== '' ? fromDate : null, to_date: toDate !== '' ? toDate : null});

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: data
    };

    fetch(BASE_URL + "/api/tokens/served-report", requestOptions)
      .then(response => response.json())
      .then(result => {
        setReportData(result)
      })
      .catch(error => console.log('error', error));
  };

  useEffect(() => {
    let mounted = true;

    fetchUserReport();

    return () => {
      mounted = false;
    };
  }, []);


  return (
    <Page
      className={classes.root}
      title="Department Report"
    >
      <Header/>
      <TextField
        id="date"
        label="From Date"
        type="date"
        value={fromDate}
        className={classes.textField}
        onChange={event => setFromDate(event.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        id="date"
        label="To Date"
        type="date"
        value={toDate}
        style={{marginLeft: 20}}
        className={classes.textField}
        onChange={event => setToDate(event.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <Button
        className={classes.saveButton}
        onClick={() => fetchUserReport()}
        color='primary'
        type="submit"
        variant="contained"
      >
        GO
      </Button>
      {reportData.length > 0 && (
        <ServedReportTable
          className={classes.results}
          reportData={reportData}
        />
      )}
    </Page>
  );
};

export default ServedReportList;
