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

const UserReportTable = props => {
  const {className, reportData, ...rest} = props;

  const classes = useStyles();

  const [selectedDepartments] = useState([]);
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
        {reportData.length} Records found. Page {page + 1} of{' '}
        {Math.ceil(reportData.length / rowsPerPage)}
      </Typography>
      <Card>
        <CardHeader
          action={<GenericMoreButton/>}
          title="All User Report"
        />
        <Divider/>
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>user</TableCell>
                    <TableCell>total served time</TableCell>
                    <TableCell>total token check</TableCell>
                    <TableCell>points</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((report, index) => (
                    <TableRow
                      hover
                      key={index}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{report.username}</TableCell>
                      <TableCell>{report.total_served_time}</TableCell>
                      <TableCell>{report.total_check_up}</TableCell>
                      <TableCell>{report.points}</TableCell>
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
            count={reportData.length}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </CardActions>
      </Card>
      <TableEditBar selected={selectedDepartments}/>
    </div>
  );
};

UserReportTable.propTypes = {
  className: PropTypes.string,
  reportData: PropTypes.array.isRequired
};

UserReportTable.defaultProps = {
  reportData: []
};

export default UserReportTable;
