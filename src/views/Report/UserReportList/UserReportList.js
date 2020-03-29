import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/styles';

import {Page} from 'components';
import {Header, DepartmentTable} from './components';
import {BASE_URL} from "../../../config";
import TextField from "@material-ui/core/TextField";
import {Button} from "@material-ui/core";
import {addAuthorization, msToTime} from "../../../utils/functions";

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

const UserReportList = () => {
  const classes = useStyles();

  const [reportData, setReportData] = useState([]);
  const [data, setData] = useState({});
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');


  const generateUserReport = (data) => {
    const report_data = [];
    // first fetch the user
    // after fetching the user fetch the token
    // now generate the user report
    // foreach user calculate the total served time. SUM (serving_start - serving_end)
    // total token checked = SUM (token checked)
    // point = (total served time * total token checked)
    data.users.forEach(user => {
      // filter the tokens by the user
      let user_tokens = data.tokens.filter(t => t.user.id === user.id);
      let total_check_up = 0;
      let milliseconds = 0;
      user_tokens.forEach(token => {
        // subtract the serving start and serving end time
        // check if the token createdAt is greater than fromDate and createdAt is less than toDate
        let is_greater = fromDate !== '' ? new Date(token.createdAt) >= new Date(fromDate) : true;
        let is_less = toDate !== '' ? new Date(token.createdAt) <= new Date(toDate) : true;
        if (is_greater && is_less) {
          let dif = (new Date(token.serving_end) - new Date(token.serving_start)); // milliseconds
          milliseconds = milliseconds + dif;
          total_check_up++;
        }
      });
      let minutes = (milliseconds / 60000).toFixed(2);
      report_data.push({
        username: user.username,
        total_served_time: msToTime(milliseconds),
        total_check_up: total_check_up,
        points: (minutes * total_check_up).toFixed(2)
      });
    });
    setReportData(report_data);
  };
  useEffect(() => {
    let mounted = true;

    const fetchUserReport = () => {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders = addAuthorization(myHeaders);

      let requestOptions = {
        method: 'GET',
        headers: myHeaders
      };
      fetch(BASE_URL + "/api/tokens/user-report", requestOptions)
        .then(response => response.json())
        .then(report => {
          if (mounted) {
            generateUserReport(report);
            setData(report);
          }
        })
        .catch(error => console.log('error', error));
    };

    fetchUserReport();

    return () => {
      mounted = false;
    };
  }, []);


  return (
    <Page
      className={classes.root}
      title="User Report"
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
        onClick={() => generateUserReport(data)}
        color='primary'
        type="submit"
        variant="contained"
      >
        GO
      </Button>
      {reportData.length > 0 && (
        <DepartmentTable
          className={classes.results}
          reportData={reportData}
        />
      )}
    </Page>
  );
};

export default UserReportList;
