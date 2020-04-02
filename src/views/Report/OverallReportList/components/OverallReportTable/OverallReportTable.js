import React, {useState} from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@material-ui/core';

import {GenericMoreButton} from 'components';
import moment from "moment";
import {msToTime} from "../../../../../utils/functions";

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

const OverallReportTable = props => {
  const {className, tokens, ...rest} = props;
  const classes = useStyles();
  const dict = {
    'TOKEN_CREATED': 'Created',
    'TOKEN_SERVED': 'Served',
    'TOKEN_CALLED': 'Called',
    'TOKEN_NOT_CAME': 'Not present'
  };
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
        {tokens.length} Records found. Page {page + 1} of{' '}
        {Math.ceil(tokens.length / rowsPerPage)}
      </Typography>
      <Card>
        <CardHeader
          action={<GenericMoreButton/>}
          title="All Tokens"
        />
        <Divider/>
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align='center'>#</TableCell>
                    <TableCell align='center'>User</TableCell>
                    <TableCell align='center'>Customer</TableCell>
                    <TableCell align='center'>Number</TableCell>
                    <TableCell align='center'>Department</TableCell>
                    <TableCell align='center'>Counter</TableCell>
                    <TableCell align='center'>Type</TableCell>
                    <TableCell align='center'>Status</TableCell>
                    <TableCell align='center'>Date</TableCell>
                    <TableCell align='center'>Serving Start</TableCell>
                    <TableCell align='center'>Serving End</TableCell>
                    <TableCell align='center'>Served Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tokens.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((token, index) => (
                    <TableRow
                      hover
                      key={token.id}
                    >
                      <TableCell align='center'>{index + 1}</TableCell>
                      <TableCell align='center'>{token.user ? token.user.name : '-'}</TableCell>
                      <TableCell align='center'>{token.customer ? token.customer.name : '-'}</TableCell>
                      <TableCell align='center'>{token.token_number}</TableCell>
                      <TableCell align='center'>{token.department ? token.department.letter : '-'}</TableCell>
                      <TableCell align='center'>{token.counter ? token.counter.name : '-'}</TableCell>
                      <TableCell align='center'>{token.type ? token.type : '-'}</TableCell>
                      <TableCell align='center'>{dict[token.status]}</TableCell>
                      <TableCell align='center'>{token.createdAt}</TableCell>
                      <TableCell
                        align='center'>{token.serving_start ? moment(token.serving_start).format('LTS') : '-'}</TableCell>
                      <TableCell
                        align='center'>{token.serving_end ? moment(token.serving_end).format('LTS') : '-'}</TableCell>
                      <TableCell
                        align='center'>{token.status === 'TOKEN_SERVED' ? msToTime(new Date(token.serving_end) - new Date(token.serving_start)) : '-'}</TableCell>
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
            count={tokens.length}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </CardActions>
      </Card>
    </div>
  );
};

OverallReportTable.propTypes = {
  className: PropTypes.string,
  tokens: PropTypes.array.isRequired,
};

OverallReportTable.defaultProps = {
  tokens: []
};

export default OverallReportTable;
