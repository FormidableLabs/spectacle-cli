import { createElement } from 'react';
import { render } from 'react-dom';
import { MDXProvider } from '@mdx-js/react';

import {
  Deck,
  Slide,
  Notes,
  FlexBox,
  Box,
  Progress,
  FullScreen,
  mdxComponentMap
} from 'spectacle';

// SPECTACLE_CLI_THEME_START
const theme = {};
// SPECTACLE_CLI_THEME_END

// SPECTACLE_CLI_MDX_START
const slides = [];
const notes = [];
// SPECTACLE_CLI_MDX_END

// SPECTACLE_CLI_TEMPLATE_START
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
// SPECTACLE_CLI_TEMPLATE_END

// SPECTACLE_CLI_AUTOLAYOUT_START
const autoLayout = false;
// SPECTACLE_CLI_AUTOLAYOUT_END

const MDXSlides = () =>
  createElement(
    Deck,
    {
      autoLayout,
      loop: true,
      theme,
      template
    },
    slides
      .map((MDXSlide, i) => [MDXSlide, notes[i]])
      .map(([MDXSlide, MDXNotesForSlide], i) =>
        createElement(
          Slide,
          {
            key: `slide-${i}`,
            slideNum: i
          },
          createElement(
            MDXProvider,
            {
              components: mdxComponentMap
            },
            createElement(MDXSlide, null),
            createElement(Notes, null, createElement(MDXNotesForSlide, null))
          )
        )
      )
  );

render(createElement(MDXSlides, null), document.getElementById('root'));
