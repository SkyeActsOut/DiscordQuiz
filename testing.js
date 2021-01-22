const Discord = require ('discord.js');

const dquiz = require ('./DiscordQuiz');

const client = new Discord.Client();

token = require('./token.json');

dquiz.add_question('When was the war of 1812?', '1812', ['1800', '2020', '777']);
dquiz.log_questions();

client.on ('ready', () => {
    console.log (`Bot is ready under ${client.user.tag}`)
}) 

client.on ('message', (message) => {

    if (message.content.toLowerCase().startsWith('!quiz'))
        dquiz.quiz(message, 10);

}) 

client.login (token.token);