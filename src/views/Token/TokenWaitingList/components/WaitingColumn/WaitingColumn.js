import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/styles';
import './WaitingColumn.css';
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

const WaitingColumn = props => {
  const {departmentTokens, totalItems, fromQueue, toQueue} = props;
  const {department, tokens} = departmentTokens;
  // since array items starts from 0 index
  // we need to make fromQueue - 1 and toQueue - 1
  const display_tokens = [];
  const start_index = fromQueue - 1;
  const end_index = toQueue - 1;
  let count = 0;

  for (let i = end_index; i >= start_index; i--) {
    if (tokens[i] && count < 3) {
      display_tokens.unshift(tokens[i]);
      count++;
    }
    console.log('count = ' + count);
  }
  const classes = useStyles();

  return (
    <Box width={totalItems > 0 ? 1 / totalItems : 'auto'}>
      <table className={"queue-table " + classes.queueTable}>
        <thead>
        <tr style={{backgroundColor: department.color, color: "#fff"}}>
          <th className="center-align"><h3 style={{margin: 0, padding: 0}}>{department.letter}</h3></th>
        </tr>
        </thead>
        <tbody>
        {
          display_tokens.map((t, key) => {
            return (
              <tr key={key} style={{backgroundColor: generateBrighterColor(department.color, 95)}}>
                <td className="center-align" style={{margin: 0, padding: 9}}>
                  <h4 style={{margin: 0, padding: 0}}>
                    {t.token_number} {t.priority ? '(P)' : ''}
                  </h4>
                </td>
              </tr>
            )
          })
        }
        </tbody>
      </table>
    </Box>
  );
};

WaitingColumn.propTypes = {
  departmentTokens: PropTypes.object,
  totalItems: PropTypes.number.isRequired,
  fromQueue: PropTypes.number.isRequired,
  toQueue: PropTypes.number.isRequired
};

export default WaitingColumn;
