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

const ServedReportTable = props => {
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
  let total_served = 0;
  for (let i = 0; i < reportData.length; i++) {
    total_served = total_served + reportData[i].total_served;
  }


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
          title="All Reports"
        />
        <Divider/>
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>total served</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((report, index) => (
                    <TableRow
                      hover
                      key={index}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{report.department_name}</TableCell>
                      <TableCell>{report.total_served}</TableCell>
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
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Total Served</TableCell>
            <TableCell>{total_served}</TableCell>
            <TableCell/>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

ServedReportTable.propTypes = {
  className: PropTypes.string,
  reportData: PropTypes.array.isRequired
};

ServedReportTable.defaultProps = {
  reportData: []
};

export default ServedReportTable;
