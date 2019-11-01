import { createElement } from 'react';
import { render } from 'react-dom';

import { Deck, FlexBox, Text, Markdown } from 'spectacle';

// TODO: INJECT THEME REQUIRE

// TODO: INJECT MD CONTENT
const mdContent = `### TODO SLIDES`;

const MDSlides = () =>
  createElement(
    Deck,
    {
      loop: true,
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
