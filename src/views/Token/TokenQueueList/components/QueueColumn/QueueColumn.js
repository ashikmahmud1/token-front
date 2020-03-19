import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/styles';
import './QueueColumn.css';
import {generateBrighterColor} from "utils/functions";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles(() => ({
  root: {},
  queueColumn: {
    width: 300,
    height: '85vh',
    marginRight: 20
  },
  card: {
    width: 300
  },
  queueTable: {
    width: '100%'
  }
}));

const QueueColumn = props => {
  const {departmentTokens, totalItems} = props;
  const {department, tokens} = departmentTokens;

  const classes = useStyles();

  return (
      <Box p={1} width={totalItems > 0 ? 1/totalItems: 'auto'}>
        <table className={"queue-table " + classes.queueTable}>
          <thead>
          <tr style={{backgroundColor: department.color, color: "#fff"}}>
            <th className="center-align"><h3 style={{margin: 0, padding: 0}}>{department.letter}</h3></th>
            <th className="center-align"><h3 style={{margin: 0, padding: 0}}>Counter</h3></th>
          </tr>
          </thead>
          <tbody>
          {
            tokens.map((t, key) => {
              return (
                <tr key={key} style={{backgroundColor: generateBrighterColor(department.color,95)}}>
                  <td className="center-align" style={{margin: 0, padding: 9}}><h4
                    style={{margin: 0, padding: 0}}>{t.token_number}</h4></td>
                  <td className="center-align" style={{margin: 0, padding: 9}}><h4
                    style={{margin: 0, padding: 0}}>{t.counter ? t.counter.letter : ''}</h4></td>
                </tr>
              )
            })
          }
          </tbody>
        </table>
      </Box>
  );
};

QueueColumn.propTypes = {
  departmentTokens: PropTypes.object,
  totalItems: PropTypes.number
};

export default QueueColumn;
