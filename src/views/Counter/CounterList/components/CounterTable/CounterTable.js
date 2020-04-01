import React, {useState} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {makeStyles} from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Button,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@material-ui/core';

import {GenericMoreButton, TableEditBar} from 'components';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 700
  },
  nameCell: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    height: 42,
    width: 42,
    marginRight: theme.spacing(1)
  },
  actions: {
    padding: theme.spacing(1),
    justifyContent: 'flex-end'
  }
}));

const CounterTable = props => {
  const {className, deleteCounter, counters, ...rest} = props;

  const classes = useStyles();

  const [selectedCustomers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, page) => {
    setPage(page);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(event.target.value);
  };

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Typography
        color="textSecondary"
        gutterBottom
        variant="body2"
      >
        {counters.length} Records found. Page {page + 1} of{' '}
        {Math.ceil(counters.length / rowsPerPage)}
      </Typography>
      <Card>
        <CardHeader
          action={<GenericMoreButton/>}
          title="All users"
        />
        <Divider/>
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Letter</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {counters.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(counter => (
                    <TableRow
                      hover
                      key={counter.id}
                      selected={selectedCustomers.indexOf(counter.id) !== -1}
                    >
                      <TableCell>
                        <div className={classes.nameCell}>
                          <div>
                            <Link
                              color="inherit"
                              component={RouterLink}
                              to={"/counter/edit/" + counter.id}
                              variant="h6"
                            >
                              {counter.name}
                            </Link>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{counter.letter}</TableCell>
                      <TableCell align="center">
                        <Button
                          color="primary"
                          component={RouterLink}
                          size="small"
                          to={"/counter/edit/" + counter.id}
                          variant="outlined"
                        >
                          Edit
                        </Button>
                        <Button
                          style={{color: '#e53935', marginLeft: 10}}
                          onClick={() => deleteCounter(counter.id)}
                          size="small"
                          variant="outlined"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </PerfectScrollbar>
        </CardContent>
        <CardActions className={classes.actions}>
          <TablePagination
            component="div"
            count={counters.length}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </CardActions>
      </Card>
      <TableEditBar selected={selectedCustomers}/>
    </div>
  );
};

CounterTable.propTypes = {
  className: PropTypes.string,
  counters: PropTypes.array.isRequired,
  deleteCounter: PropTypes.func.isRequired
};

CounterTable.defaultProps = {
  counters: []
};

export default CounterTable;
