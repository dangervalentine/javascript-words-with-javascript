# Words With Javascript [see it here](https://dangervalentine.github.io/javascript-words-with-javascript/)

Words With Friends or WordScape are games where a player is given a series of letters and you are challenged to find as many words as you can with these letters. For example, you could be given the letters, 'p', 'a', 'l', and 'm'. Using these letters, you can make the words, 'map', 'amp', 'pal','lamp', 'palm' and others. What this SPA does is show you these words by iterating through over English 170,000 words and finds ones that are made out of the letters provided.

---

![Words With JavaScript](https://raw.githubusercontent.com/victoriousj/javascript-words-with-javascript/master/wwjs.PNG)

---

## Usage

Use Git to clone the repository. Open the solution in Visual Studio if you want to develop it.

```bash
git clone https://github.com/victoriousj/javascript-words-with-javascript.git
```

## About

My dad has spent hours and hours playing these games and he asks his family and friends to help him find a final tricky word that eludes him. This seemed like an easy thing to solve, easier than the effort spent to actually play the game.

## How It Works

This will turn the input letters in to an JS object with a key for every letter. It will then give each letter a value corresponding to the amount of times the letter appears. The letters 'r', 'l', 'l', 'e', 'a', and 'y' would look like this:

![Words With JavaScript](./really.png?raw=true)

The word 'real' would look like this:

![Words With JavaScript](./real.png?raw=true)

and all of these letters would be found in the first image, so this is a match. The word 'table' looks like this:

![Words With JavaScript](./table.png?raw=true)

the letters 'b' and 't' are not found in the first image, so this is not a match and is discarded.

This pattern is run over 170,000 words in order to determine matches and then these results are displayed on screen in order of word length.

## License

[MIT](https://choosealicense.com/licenses/mit/)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
