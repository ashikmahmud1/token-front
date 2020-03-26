import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/styles';

import {Page} from 'components';
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

const UserReportList = () => {
  const classes = useStyles();

  const [reportData, setReportData] = useState([]);


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
      let total_served_time = 0;
      user_tokens.forEach(token => {
        // subtract the serving start and serving end time
        let dif = (new Date(token.serving_end) - new Date(token.serving_start));
        let min = dif / 60000;
        total_served_time = total_served_time + min;
      });
      report_data.push({
        username: user.username,
        total_served_time: total_served_time.toFixed(2),
        total_check_up: user_tokens.length,
        points: (total_served_time * user_tokens.length).toFixed(2)
      });
    });
    setReportData(report_data);
  };
  useEffect(() => {
    let mounted = true;

    const fetchUserReport = () => {
      fetch(BASE_URL + "/api/tokens/user-report")
        .then(response => response.json())
        .then(report => {
          if (mounted) {
            generateUserReport(report);
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
      title="Department Management List"
    >
      <Header/>
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
