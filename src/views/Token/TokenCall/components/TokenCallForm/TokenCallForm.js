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
import {addAuthorization} from "../../../../../utils/functions";

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
      token_user: null,
      status: "TOKEN_CALLED",
      type: "type1",
      otherText: '',
      NOT_PRESENT: false
    };
  }

  onChangeType = (event, option) => {
    this.setState({type: option.value});
  };

  onChangeText = event => {
    this.setState({
      ...this.state,
      [event.target.name]:
        event.target.type === 'checkbox'
          ? event.target.checked
          : event.target.value
    });
  };

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

  onTokenReset = (departmentTokens) => {
    if (departmentTokens)
      this.setState({departmentTokens});
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

    if (localStorage.getItem('token_user')) {
      this.setState({token_user: JSON.parse(localStorage.getItem('token_user'))});
    }
    if (localStorage.getItem('current_call')) {
      this.setState({current_call: JSON.parse(localStorage.getItem('current_call'))});
    }
    fetch(BASE_URL + "/api/counters/")
      .then(response => response.json())
      .then(counters => {
        this.setState({ counters, counter_id: department_counter.counter_id});
      })
      .catch(error => console.log('error', error));

    fetch(BASE_URL + "/api/departments/")
      .then(response => response.json())
      .then(departments => {
        this.setState({ departments, department_id: department_counter.department_id});
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
    myHeaders = addAuthorization(myHeaders);

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

    // check who is in the token list who is still not get called. then call that token
    let next_call = {department: null, token: null, counter: null};
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].status !== 'TOKEN_CALLED') {
        next_call.department = department;
        next_call.counter = counter;
        next_call.token = tokens[i];
        break;
      }
    }
    // check who is currently in the current call
    if (this.state.current_call.department) {
      // update the current token is served
      this.updateToken(this.state.current_call.token, {
        status: this.state.NOT_PRESENT ? "TOKEN_NOT_CAME" : "TOKEN_SERVED",
        counter_id: this.state.counter_id,
        type: this.state.type === 'other' ? this.state.otherText : this.state.type,
        serving_end: this.state.NOT_PRESENT ? null : new Date()
      }).then(res => res.json())
        .then(result => {
          console.log(result);
          this.setState({type: 'type1', NOT_PRESENT: false, otherText: ''});
          // call the next token in the queue-list
          // scan the tokens in the current department
          // get the top who is still not get called
          // update the token counter also the serving_start time
          if (next_call.token !== null) {
            this.updateToken(next_call.token, {
              status: "TOKEN_CALLED",
              counter_id: this.state.counter_id,
              serving_start: new Date(),
              user_id: this.state.token_user ? this.state.token_user.id: null
            }).then(response => response.json())
              .then(result => {
                console.log(result);
                localStorage.setItem('current_call', JSON.stringify(next_call));
                this.setState({...this.state, current_call: next_call});
              });
          } else {
            this.setState({...this.state, current_call: {department: null, token: null, counter: null}});
          }
        })
    } else {
      if (next_call.token !== null) {
        this.updateToken(next_call.token, {
          status: "TOKEN_CALLED",
          counter_id: this.state.counter_id,
          serving_start: new Date(),
          user_id: this.state.token_user ? this.state.token_user.id: null
        }).then(response => response.json())
          .then(result => {
            console.log(result);
            localStorage.setItem('current_call', JSON.stringify(next_call));
            this.setState({...this.state, current_call: next_call});
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
                  type={this.state.type}
                  otherText={this.state.otherText}
                  NOT_PRESENT={this.state.NOT_PRESENT}
                  customer={this.state.current_call}
                  onStop={this.onStop}
                  onNext={this.onNext}
                  onReCall={this.onReCall}
                  onChangeText={this.onChangeText}
                  onChangeType={this.onChangeType}/>
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
