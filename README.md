# Discord Quiz

An NPM package to help create simple quizzes for Discord bots.
By SkyMocha.

## Installation


```bash
npm i discord-quiz
```

## Usage

```javascript
const Discord = require ('discord.js');
const dquiz = require ('discord-quiz');
const client = new Discord.Client();

// Adds a question to the pool of available questions
dquiz.add_question('When was the war of 1812?', '1812', ['1800', '2020', '777']);

client.on ('message', (message) => {
    if (message.content.toLowerCase().startsWith('!quiz'))
        dquiz.quiz(message, 10, 'ffb7c5'); // Runs the quiz command
}) 

client.login (<your token>);
```

## Documentation
**void** add_question(**String** *question*, **String** *correct_answer*, **String[]** *false_answers*)

**void** quiz(`Discord Message`, `Time in Seconds`, `Hex Code`)

## License
[ISC](https://choosealicense.com/licenses/isc/)