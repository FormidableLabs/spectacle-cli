import { createElement } from 'react';
import { render } from 'react-dom';
import { MDXProvider } from '@mdx-js/react';

import { Deck, Slide, Notes, FlexBox, Text, mdxComponentMap } from 'spectacle';

// TODO: INJECT THEME REQUIRE
// SPECTACLE_CLI_THEME_START
const theme = {};
// SPECTACLE_CLI_THEME_END

// SPECTACLE_CLI_MDX_START
const slides = [];
const notes = [];
// SPECTACLE_CLI_MDX_END

const MDXSlides = () =>
  createElement(
    Deck,
    {
      loop: true,
      theme,
      template: ({ numberOfSlides, slideNumber }) =>
        createElement(
          FlexBox,
          {
            justifyContent: 'space-between',
            position: 'absolute',
            bottom: 0,
            width: 1
          },
          createElement(
            Text,
            {
              fontSize: 16,
              color: 'quinary',
              fontWeight: 'bold'
            },
            'Slide ',
            slideNumber,
            ' of ',
            numberOfSlides - 1
          )
        )
    },
    slides.map((MDXSlide, i) => {
      const NotesForSlide = notes[i];
      return createElement(
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
          createElement(Notes, null, createElement(NotesForSlide, null))
        )
      );
    })
  );

render(createElement(MDXSlides, null), document.getElementById('root'));
