const Discord = require ('discord.js');

const dquiz = require ('./discord-quiz');

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.DIRECT_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Discord.Intents.FLAGS.GUILD_PRESENCES] });

token = require('./token.json');

dquiz.add_question('When was the war of 1812?', '1812', ['1800', '2020', '777']);
console.log (dquiz.get_questions());

client.on ('ready', () => {
    console.log (`Bot is ready under ${client.user.tag}`)
}) 

client.on ('messageCreate', (message) => {

    if (message.content.toLowerCase().startsWith('!quiz'))
        dquiz.quiz(message, 10, 'ffb7c5');

}) 

client.login (token.token);