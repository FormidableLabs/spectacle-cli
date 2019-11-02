// `react`, `react-dom`, and `spectacle` are already provided as built-in dependencies.
import React from 'react';
import { Slide, Text, Appear } from 'spectacle';

// Use all the power of Spectacle components!
// TODO: Appear doesn't appear.
const SpectacleSlide = () => {
  return (
    <React.Fragment>
      <Text fontSize="subHeader">Slide 3!</Text>
      <Appear elementNum={0}>
        <Text>{`Hey, just one "animated" slide element here`}</Text>
      </Appear>
    </React.Fragment>
  );
};

export default SpectacleSlide;
