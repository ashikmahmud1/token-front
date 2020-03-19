import React, {Component} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/styles';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Divider,
  TextField,
  colors
} from '@material-ui/core';
import {BASE_URL} from "../../../../../config";
import TokenInfo from "../TokenInfo";
import useRouter from 'utils/useRouter';
import SocketConnection from "../../../../../components/SocketConnection";

const useStyles = makeStyles(theme => ({
  root: {},
  saveButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  }
}));

const TokenCallForm = () => {
  const classes = useStyles();
  const router = useRouter();

  return (
    <CallForm classes={classes} router={router}/>
  )

};


class CallForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counters: [],
      departments: [],
      departmentTokens: {},
      counter_id: "",
      department_id: "",
      current_call: {department: null, token: null, counter: null},
      status: "TOKEN_CALLED"
    }
  }

  onTokenCreated = (departmentTokens) => {
    if (departmentTokens)
      this.setState({departmentTokens});
  };

  onTokenServed = (departmentTokens) => {
    if (departmentTokens)
      this.setState({departmentTokens});
  };

  onTokenCalled = (departmentTokens, message) => {
    console.log(message);
    if (departmentTokens)
      this.setState({departmentTokens});
  };

  onTokenDeleted = (departmentTokens) => {
    if (departmentTokens)
      this.setState({departmentTokens});
  };

  onTokenReset = (department) => {
    console.log(department);
  };

  onSetTokens = (departmentTokens) => {
    this.setState({departmentTokens});
  };


  componentDidMount() {
    let department_counter = {
      counter_id: '',
      department_id: ''
    };
    if (localStorage.getItem('department_counter')) {
      department_counter = JSON.parse(localStorage.getItem('department_counter'));
    } else {
      localStorage.setItem('department_counter', JSON.stringify(department_counter));
    }
    fetch(BASE_URL + "/api/counters/")
      .then(response => response.json())
      .then(counters => {
        this.setState({...this.state, counters, counter_id: department_counter.counter_id});
      })
      .catch(error => console.log('error', error));

    fetch(BASE_URL + "/api/departments/")
      .then(response => response.json())
      .then(departments => {
        this.setState({...this.state, departments, department_id: department_counter.department_id});
      })
      .catch(error => console.log('error', error));
  }

  handleChange = event => {
    event.persist();
    let department_counter = JSON.parse(localStorage.getItem('department_counter'));
    department_counter[event.target.name] = parseInt(event.target.value);
    localStorage.setItem('department_counter', JSON.stringify(department_counter));
    this.setState({
      ...this.state,
      [event.target.name]:
        event.target.type === 'checkbox'
          ? event.target.checked
          : event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
  };

  updateToken = (token, data) => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify(data);

    let requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw
    };

    return fetch(BASE_URL + "/api/tokens/" + token.id, requestOptions);
  };

  onReCall = () => {
    if (this.state.current_call.department) {
      this.updateToken(this.state.current_call.token, {
        status: "TOKEN_CALLED"
      }).then(res => {
        console.log('re-calling...');
      })
    }

  };

  onStop = () => {
    if (this.state.current_call.department) {
      this.updateToken(this.state.current_call.token, {
        status: "TOKEN_SERVED",
        serving_end: new Date()
      }).then(res => {
        console.log('stopping...');
        this.setState({...this.state, current_call: {department: null, token: null, counter: null}});
      })
    }
  };

  onNext = () => {
    let tokens = this.state.departmentTokens[this.state.department_id].tokens;
    let department = this.state.departments.find(d => parseInt(d.id) === parseInt(this.state.department_id));
    let counter = this.state.counters.find(c => parseInt(c.id) === parseInt(this.state.counter_id));
    let current_call = {department, counter};
    // check who is currently in the current call
    if (this.state.current_call.department) {
      // update the current token is served
      this.updateToken(this.state.current_call.token, {
        status: "TOKEN_SERVED",
        counter_id: this.state.counter_id,
        serving_end: new Date()
      }).then(res => res.json())
        .then(result => {
          // console.log(result);
          // call the next token in the queue-list
          // scan the tokens in the current department
          // get the top who is still not get called
          // update the token counter also the serving_start time
          console.log(tokens);
          if (tokens.length > 1) {
            current_call.token = tokens[1];
            this.updateToken(tokens[1], {
              status: "TOKEN_CALLED",
              counter_id: this.state.counter_id,
              serving_start: new Date()
            }).then(response => response.json())
              .then(result => {
                // console.log(result);
                this.setState({...this.state, current_call});
              });
          } else {
            this.setState({...this.state, current_call: {department: null, token: null, counter: null}});
          }
        })
    } else {
      if (tokens.length > 0) {
        current_call.token = tokens[0];
        this.updateToken(tokens[0], {
          status: "TOKEN_CALLED",
          counter_id: this.state.counter_id,
          serving_start: new Date()
        }).then(response => response.json())
          .then(result => {
            // console.log(result);
            this.setState({...this.state, current_call});
          });
      }
    }

  };

  render() {
    const {className, classes, ...rest} = this.props;
    const {departments, counters} = this.state;
    return (
      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >
        <form onSubmit={this.handleSubmit}>
          <CardHeader title="Token"/>
          <Divider/>
          <CardContent>
            <Grid
              container
              spacing={4}
            >
              <Grid
                item
                md={12}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Select Department"
                  name="department_id"
                  onChange={this.handleChange}
                  select
                  // eslint-disable-next-line react/jsx-sort-props
                  SelectProps={{native: true}}
                  value={this.state.department_id}
                  required
                  variant="outlined"
                >
                  <option value=""/>
                  {departments.map(department => (
                    <option
                      key={department.id}
                      value={department.id}
                    >
                      {department.name}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid
                item
                md={12}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Select Counter"
                  name="counter_id"
                  onChange={this.handleChange}
                  select
                  // eslint-disable-next-line react/jsx-sort-props
                  SelectProps={{native: true}}
                  value={this.state.counter_id}
                  required
                  variant="outlined"
                >
                  <option value=""/>
                  {counters.map(counter => (
                    <option
                      key={counter.id}
                      value={counter.id}
                    >
                      {counter.name}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid
                item
                md={12}
                xs={12}
              >
                <TokenInfo
                  customer={this.state.current_call}
                  onStop={this.onStop}
                  onNext={this.onNext}
                  onReCall={this.onReCall}/>
              </Grid>
            </Grid>
          </CardContent>
        </form>
        <SocketConnection
          onTokenCreated={this.onTokenCreated}
          onTokenServed={this.onTokenServed}
          onTokenCalled={this.onTokenCalled}
          onTokenDeleted={this.onTokenDeleted}
          onTokenReset={this.onTokenReset}
          onSetTokens={this.onSetTokens}/>
      </Card>
    );
  }
}

TokenCallForm.propTypes = {
  className: PropTypes.string
};

export default TokenCallForm;
