const Discord = require('discord.js');

class Question {
    constructor(q, a, f) {
        this.question = q;
        this.answer = a;
        this.false = f;
    }
}

var questions = [
    
]

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

exports.add_question = function (question, correct_answer, false_answers) {

    if (false_answers != 3 || !false_answers instanceof Array)
        return console.error('"false_answers" must be a array type with exactly 3 string members.');
    if (typeof question != 'string')
        return console.error('"question" must be a string.');
    if (typeof correct_answer != 'string')
        return console.error('"correct_answer" must be a string.');

    questions.push(new Question (question, correct_answer, false_answers))
}

// new Question ('When was the war of 1812?', '1812', ['1800', '2020', '777']), 
// new Question ('What is pi?', '3.14', ['Rad 2', 'Pineapple', 'Cheese'])

exports.log_questions = function () {
    console.log(questions);
}

exports.get_questions = function () {
    return questions;
}

exports.quiz = function (message, time, embed_color="0000ff") {

    if (!Discord.Message.prototype.isPrototypeOf (message))
        return console.error ('"message" must be of type Message from discord.js');

    if (typeof time != 'number')
        return console.error ('"time" must be a number.');
    
    var q = questions[Math.floor(Math.random() * questions.length)]
    
    if (typeof q == 'undefined' || q.length <= 0)
        return console.error("You have to add questions before running the quiz function.");

    var a = shuffle([q.answer, q.false[0], q.false[1], q.false[2]])

    message.channel.send (new Discord.MessageEmbed()
        .setAuthor(`Question: ${q.question}`, message.client.user.avatarURL)
        .setDescription(
            `A ) ${a[0]}
            B ) ${a[1]}
            C ) ${a[2]}
            D ) ${a[3]}`
        )
        .setColor(embed_color)
    ).then (async msg => {

        await msg.react('🇦');
        await msg.react('🇧');
        await msg.react('🇨');
        await msg.react('🇩');

        const filter = (reaction, user) => {
            return ['🇦', '🇧', '🇨', '🇩'].includes(reaction.emoji.name) && !user.bot;
        };

        // const filter = (reaction, user) => reaction.emoji.name == '🇦' || reaction.emoji.name == '🇧' || reaction.emoji.name == '🇨' || reaction.emoji.name == '🇩'
        msg.awaitReactions(filter, { max: 1, time: time*1000, errors: ['time'] })
            .then(collected => {

                var reaction = collected.first().emoji.name;
                var challanger = collected.first().users.cache.last();

                if (reaction == '🇦') {
                    if (a[0] == q.answer) message.channel.send(new Discord.MessageEmbed ().setDescription(`${challanger} got it correct!`).setColor('00ff00'))
                    else message.channel.send (new Discord.MessageEmbed ().setDescription(`${challanger} got it wrong. The correct answer was ${q.answer}.`).setColor("ff0033"));
                }
                else if (reaction == '🇧') {
                    if (a[1] == q.answer) message.channel.send(new Discord.MessageEmbed ().setDescription(`${challanger} got it correct!`).setColor('00ff00'))
                    else message.channel.send (new Discord.MessageEmbed ().setDescription(`${challanger} got it wrong. The correct answer was ${q.answer}.`).setColor("ff0033"));
                }
                else if (reaction == '🇨') {
                    if (a[2] == q.answer) message.channel.send(new Discord.MessageEmbed ().setDescription(`${challanger} got it correct!`).setColor('00ff00'))
                    else message.channel.send (new Discord.MessageEmbed ().setDescription(`${challanger} got it wrong. The correct answer was ${q.answer}.`).setColor("ff0033"));
                }
                else if (reaction == '🇩') {
                    if (a[3] == q.answer) message.channel.send(new Discord.MessageEmbed ().setDescription(`${challanger} got it correct!`))
                    else message.channel.send (new Discord.MessageEmbed ().setDescription(`${challanger} got it wrong. The correct answer was ${q.answer}.`).setColor("ff0033"));
                }
            })
            .catch (error => {
                message.channel.send(new Discord.MessageEmbed().setDescription("Times up!").setColor("ff0033"));
            });
    })
}
