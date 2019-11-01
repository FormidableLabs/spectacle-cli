import { createElement } from 'react';
import { render } from 'react-dom';

import { Deck, FlexBox, Text, Markdown } from 'spectacle';

// SPECTACLE_CLI_THEME_START
const theme = {};
// SPECTACLE_CLI_THEME_END

// TODO: INJECT MD CONTENT
// SPECTACLE_CLI_MD_START
const mdContent = `## Empty Presentation`;
// SPECTACLE_CLI_MD_END

const MDSlides = () =>
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
    createElement(Markdown, { containsSlides: true }, mdContent)
  );

render(createElement(MDSlides, null), document.getElementById('root'));
