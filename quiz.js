const unirest = require ("unirest");

const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

// Shuffles an array
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

exports.run = function(client, message, args, options) {

    try {

    // Creates a category variable to input into the URL for the API
    var category = args[1];
    if (category == "general") category = "&category=9";
    else if (category == "books") category = "&category=10";
    else if (category == "film" || category == "movies") category = "&category=11";
    else if (category == "music") category = "&category=12";
    else if (category == "games") category = "&category=15";
    else if (category == "anime" || category == "manga") category = "&category=31";
    else if (category == "comic" || category == "comics") category = "&category=29";

    else if (category == "science" || category == "sci") category = "&category=17";
    else if (category == "computers" || category == "tech") category = "&category=18";
    else if (category == "math" || category == "maths") category = "&category=19";

    else if (category == "history") category = "&category=23";
    else if (category == "politics") category = "&category=24";
    else if (category == "geo" || category == "geography") category = "&category=22";

    else if (category == "art") category = "&category=25";

    else if (category == "sports") category = "&category=21";

    else category = "";

    // Creates a difficulty variable to input into the API URL
    var difficulty = args[2];
    if (difficulty == "hard") difficulty = "&difficulty=hard";
    else if (difficulty == "medium") difficulty = "&difficulty=medium";
    else if (difficulty == "easy") difficulty = "&difficulty=easy";

    else difficulty = "";

    // Pings the API
    unirest.get(`https://opentdb.com/api.php?amount=1${category}${difficulty}&type=multiple`)
    .header("Content-Type", "application/x-www-form-urlencoded")
    .header("Accept", "application/json")
    .end(function (result) {
        var q = result.body.results[0];

        // Scrambler
        var answers = [ entities.decode(q.correct_answer), entities.decode(q.incorrect_answers[0]), entities.decode(q.incorrect_answers[1]), entities.decode(q.incorrect_answers[2]) ];
        answers = shuffle (answers);

        // Creates embeds
        var quizEmbed = new options.Discord.RichEmbed();
            quizEmbed.setTitle(`FuzzBot Quiz | ${q.category} | ${q.difficulty.slice(0, 1).toUpperCase()}${q.difficulty.slice(1)}`);
            quizEmbed.setColor("245eb5");
            quizEmbed.setFooter("Good luck - You have 15 seconds", message.author.avatarURL);
            quizEmbed.addField (`Question: ${entities.decode(q.question)}`, `**A )** ${answers[0]} \n **B )** ${answers[1]} \n **C )** ${answers[2]} \n **D )** ${answers[3]}`);

        var quizEmbed2 = new options.Discord.RichEmbed();
            quizEmbed2.setColor("245eb5");

        // Reaction awaiter
        message.channel.send (quizEmbed).then (async qMessage => {
            await qMessage.react ('🇦');
            await qMessage.react ('🇧');
            await qMessage.react ('🇨');
            await qMessage.react ('🇩');

            filter = (reaction,user) => {
                return ['🇦', '🇧', '🇨', '🇩'].includes(reaction.emoji.name) && !user.bot;
            };

            qMessage.awaitReactions (filter, { max: 1, time: 15000, errors: ['time'] })
                // If reaction collected
                .then (collected => {
                    reaction = collected.first().emoji.name;

                    var challanger = collected.first().users.last();

                    // Reacts to message with correct or incorrect statement
                    if (reaction == '🇦') {
                        if (answers[0] == entities.decode(q.correct_answer)) quizEmbed2.setDescription(`${challanger} got it right! 😄`);
                        else quizEmbed2.setDescription(`${challanger} got it wrong. The correct answer was ${entities.decode(q.correct_answer)}`);
                    }
                    else if (reaction == '🇧') {
                        if (answers[1] == entities.decode(q.correct_answer)) quizEmbed2.setDescription(`${challanger} got it right! 😄`);
                        else quizEmbed2.setDescription(`${challanger} got it wrong. The correct answer was ${entities.decode(q.correct_answer)}`);
                    }
                    else if (reaction == '🇨') {
                        if (answers[2] == entities.decode(q.correct_answer)) quizEmbed2.setDescription(`${challanger} got it right! 😄`);
                        else quizEmbed2.setDescription(`${challanger} got it wrong. The correct answer was ${entities.decode(q.correct_answer)}`);
                    }
                    else if (reaction == '🇩') {
                        if (answers[3] == entities.decode(q.correct_answer)) quizEmbed2.setDescription(`${challanger} got it right! 😄`);
                        else quizEmbed2.setDescription(`${challanger} got it wrong. The correct answer was ${entities.decode(q.correct_answer)}`);
                    }
                    message.channel.send (quizEmbed2);
                })
                // Time limit runs out
                .catch (error => {
                    quizEmbed2.setDescription("Nobody answered 😦");
                    message.channel.send (quizEmbed2);
                });
        });
    });

    } catch (err) {
        options.catchError (message, err, "quiz", client)
    }
   
    };
    
    exports.conf = {
        name: "quiz",
        aliases: [],
    }