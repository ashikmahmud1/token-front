import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/styles';

import {Page} from 'components';
import {Header, DepartmentTable} from './components';
import {BASE_URL} from "../../../config";
import TextField from "@material-ui/core/TextField";
import {Button, Grid} from "@material-ui/core";
import {addAuthorization, search} from "../../../utils/functions";
import {Search} from "./components/";

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
  },
  search: {
    flexGrow: 1,
    maxWidth: 480,
    flexBasis: 480
  },
}));

const OverallReportList = () => {
  const classes = useStyles();
  const [tokens, setTokens] = useState([]);
  const [filterTokens, setFilterTokens] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [status, setStatus] = useState('');

  const status_arr = [
    {key: "TOKEN_CREATED", value: "Created"},
    {key: "TOKEN_SERVED", value: "Served"},
    {key: "TOKEN_CALLED", value: "Called"},
    {key: "TOKEN_NOT_CAME", value: "Not Present"},
  ];

  useEffect(() => {
    let mounted = true;

    // get all the tokens
    const fetchTokens = () => {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders = addAuthorization(myHeaders);

      let requestOptions = {
        method: 'GET',
        headers: myHeaders
      };
      fetch(BASE_URL + "/api/tokens/", requestOptions)
        .then(response => response.json())
        .then(tokens => {
          if (mounted) {
            setTokens(tokens);
            setFilterTokens(tokens);
          }
        })
        .catch(error => console.log('error', error));
    };

    fetchTokens();

    return () => {
      mounted = false;
    };
  }, []);

  const onChangeStatus = (status) => {
    setStatus(status);
    const filter_array = search(tokens, ['status'], status);
    setFilterTokens(filter_array);
  };

  const handleSearch = (event) => {
    const filter_array = search(tokens, ['token_number', 'user', 'customer', 'counter', 'department', 'type', 'priority'], event.target.value);
    setFilterTokens(filter_array);
  };

  const filter = () => {
    // check if fromDate is '' or not
    let filter_tokens = [...tokens];
    if (fromDate !== '') {
      filter_tokens = tokens.filter(t => new Date(t.createdAt) >= new Date(fromDate));
    }
    if (toDate !== '') {
      filter_tokens = tokens.filter(t => new Date(t.createdAt) <= new Date(toDate));
    }
    setFilterTokens(filter_tokens);
  };

  return (
    <Page
      className={classes.root}
      title="Overall Report"
    >
      <Header/>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
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
            onClick={() => filter()}
            color='primary'
            type="submit"
            variant="contained"
          >
            GO
          </Button>
        </Grid>
        <Grid item>
          <Search
            className={classes.search}
            onSearch={handleSearch}
          />
          <TextField
            fullWidth
            style={{marginTop:10}}
            label="Select Status"
            name="status"
            onChange={(event) => onChangeStatus(event.target.value)}
            select
            // eslint-disable-next-line react/jsx-sort-props
            SelectProps={{native: true}}
            value={status}
            required
            variant="outlined"
          >
            <option value=""/>
            {status_arr.map(status => (
              <option
                key={status.key}
                value={status.key}
              >
                {status.value}
              </option>
            ))}
          </TextField>
        </Grid>
      </Grid>
      {tokens.length > 0 && (
        <DepartmentTable
          className={classes.results}
          tokens={filterTokens}
        />
      )}
    </Page>
  );
};

export default OverallReportList;
