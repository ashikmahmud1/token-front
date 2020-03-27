import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/styles';

import {Page} from 'components';
import {Header} from './components';
import {BASE_URL} from "../../../config";
import ServedReportTable from "./components/ServedReportTable";
import {addAuthorization} from "../../../utils/functions";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  }
}));

const ServedReportList = () => {
  const classes = useStyles();

  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    let mounted = true;

    const fetchUserReport = () => {
      // post request
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders = addAuthorization(myHeaders);
      let data = JSON.stringify({});

      let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: data
      };

      fetch(BASE_URL + "/api/tokens/served-report", requestOptions)
        .then(response => response.json())
        .then(result => {
          if (mounted) setReportData(result)
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
        <ServedReportTable
          className={classes.results}
          reportData={reportData}
        />
      )}
    </Page>
  );
};

export default ServedReportList;
