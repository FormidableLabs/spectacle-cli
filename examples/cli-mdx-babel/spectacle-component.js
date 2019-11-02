// `react`, `react-dom`, and `spectacle` are already provided as built-in dependencies.
import React from 'react';
import { Heading, Text } from 'spectacle';

// Use all the power of Spectacle components!
/*global codegen*/
const message = codegen`module.exports = "'This message was babel codegen-ed'";`;

const SpectacleSlide = () => {
  return (
    <React.Fragment>
      <Heading>A Spectacle JSX Component</Heading>
      <Text>{message}!</Text>
    </React.Fragment>
  );
};

export default SpectacleSlide;
