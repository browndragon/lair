import { jest, test, expect } from '@jest/globals';
import {Cursor, Machine} from '@browndragon/sm';
import Line from './line';
import Option from './option';


// From https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md
const cut = `
- I looked at Monsieur Fogg 
*    ... and I could contain myself no longer.
    'What is the purpose of our journey, Monsieur?'
    'A wager,' he replied.
    * *     'A wager!'[] I returned.
            He nodded. 
            * * *     'But surely that is foolishness!'
            * * *  'A most serious matter then!'
            - - -     He nodded again.
            * * *    'But can we win?'
                    'That is what we will endeavour to find out,' he answered.
            * * *    'A modest wager, I trust?'
                    'Twenty thousand pounds,' he replied, quite flatly.
            * * *     I asked nothing further of him then[.], and after a final, polite cough, he offered nothing more to me. <>
    * *     'Ah[.'],' I replied, uncertain what I thought.
    - -     After that, <>
*    ... but I said nothing[] and <> 
- we passed the day in silence.
- -> END
`;

class Choose {

    // wager() {
    //     let o = this.options();
    //     this.l`I looked at Monsieur Fogg`;
    //     return o.choose(
    //         o`... and I could contain myself no longer.``
    //         'What is the purpose of our journey, Monsieur?'
    //         'A wager,' he replied.`(
    //             // Okay! So having created an option, it needs a "tail".
    //             // If this is a varargs, it must be a varargs of *other* options.
    //             o`'A wager!'`` I returned.
    //             He nodded.`(
    //                 o`But surely that is foolishness!`,
    //                 // This one doesn't continue, so it will fall through to the next choice.
    //                 o`A most serious matter then`,
    //             this.e`He nodded again.`(() => {
    //                 this.o`'But can we win?'``
    //                 'That is what we will endeavour to find out, ' he answered.`;
    //                 this.o`'A modest wager, I trust?'``
    //                 'Twenty thousand pounds,' he replied, quite flatly.`;
    //                 this.o`I asked nothing further of him then``.``, and after a final, polite cough, he offered nothing more to me. `;
    //             }),
    //         });
    //         this.o`'Ah``.'``,' I replied, uncertain what I thought.`;
    //         this.e`After that, `;  // Needs implementation.
    //     }),
    //     this.o`... but I said nothing`` and `;
    //     this.e`we passed the day in silence.`(null);  // Not just undefined...
    // }
    get l() {
        return Line.tag;
    }
    get o() {
        return Option.tag;
    }

}
test('stub', () => {});

