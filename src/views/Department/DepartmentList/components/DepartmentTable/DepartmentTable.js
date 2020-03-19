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

const DepartmentTable = props => {
  const {className, departments, deleteDepartment, resetDepartment, ...rest} = props;

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
        {departments.length} Records found. Page {page + 1} of{' '}
        {Math.ceil(departments.length / rowsPerPage)}
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
                    <TableCell>Start Number</TableCell>
                    <TableCell>Color</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {departments.slice(0, rowsPerPage).map(department => (
                    <TableRow
                      hover
                      key={department.id}
                      selected={selectedDepartments.indexOf(department.id) !== -1}
                    >
                      <TableCell>
                        <div className={classes.nameCell}>
                          <div>
                            <Link
                              color="inherit"
                              component={RouterLink}
                              to={"/department/edit/" + department.id}
                              variant="h6"
                            >
                              {department.name}
                            </Link>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{department.letter}</TableCell>
                      <TableCell>
                        {department.start_number}
                      </TableCell>
                      <TableCell>
                        <div style={{
                          width: 20,
                          height: 20,
                          borderRadius: 20,
                          backgroundColor: department.color,
                        }}/>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          color="primary"
                          component={RouterLink}
                          size="small"
                          to={"/department/edit/" + department.id}
                          variant="outlined"
                        >
                          Edit
                        </Button>
                        <Button
                          style={{color: '#e53935', marginLeft: 10}}
                          size="small"
                          onClick={() => deleteDepartment(department.id)}
                          variant="outlined"
                        >
                          Delete
                        </Button>
                        <Button
                          style={{marginLeft: 10}}
                          color="primary"
                          size="small"
                          onClick={() => resetDepartment(department.id)}
                          variant="outlined"
                        >
                          Reset
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
            count={departments.length}
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

DepartmentTable.propTypes = {
  className: PropTypes.string,
  departments: PropTypes.array.isRequired,
  deleteDepartment: PropTypes.func.isRequired,
  resetDepartment: PropTypes.func.isRequired
};

DepartmentTable.defaultProps = {
  departments: []
};

export default DepartmentTable;
