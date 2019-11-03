/**
 * Custom template overrides.
 */
import { createElement } from 'react';
import { FlexBox, Box, Progress, FullScreen } from 'spectacle';

const template = () =>
  createElement(
    FlexBox,
    {
      justifyContent: 'space-between',
      position: 'absolute',
      bottom: 0,
      width: 1
    },
    [
      createElement(
        Box,
        { padding: 10, key: 'progress-templ' },
        createElement(Progress)
      ),
      createElement(
        Box,
        { padding: 10, key: 'fullscreen-templ' },
        createElement(FullScreen)
      )
    ]
  );

export default template;
