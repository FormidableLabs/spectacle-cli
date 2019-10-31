import { createElement } from 'react';
import { render } from 'react-dom';
import { MDXProvider } from '@mdx-js/react';

import {
  Deck,
  Slide,
  Notes,
  FlexBox,
  Text,
  Appear,
  mdxComponentMap
} from 'spectacle';

// TODO: FIX THIS IMPORT
//import slides, { notes } from 'spectacle-user-mdx';
const slides = [];
const notes = [];

const MDXSlides = () =>
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

    // TODO: TEMP NON-MDX SLIDE
    createElement(
      Slide,
      null,
      createElement(
        Text,
        {
          fontSize: 'subHeader'
        },
        'Slide 3!'
      ),
      createElement(
        Appear,
        {
          elementNum: 0
        },
        createElement(Text, null, `Hey, just one "animated" slide element here`)
      )
    ),

    // TODO: REENABLE WITH ACTUAL MDX SLIDES
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
