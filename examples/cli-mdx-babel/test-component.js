import React from 'react';
import PropTypes from 'prop-types';

const Test = ({ height }) => {
  return (
    <div
      style={{
        height,
        width: '100%',
        backgroundColor: 'yellow',
        fontSize: '2em',
        color: 'blue'
      }}
    >
      JSX React component
    </div>
  );
};

Test.propTypes = {
  height: PropTypes.number.isRequired
};

export default Test;
