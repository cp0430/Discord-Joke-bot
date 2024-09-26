const Discord = require('discord.js');
const https = require('https');

const client = new Discord.Client();

const apiUrl = "https://v2.jokeapi.dev/joke/Programming?safe-mode";

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if(msg.content ==="joke" || msg.content ==="funny"){
        fetchJoke((errr, randomJoke) =>{
            if(errr) {
                msg.reply("Try again");
            }else{
                msg.reply(randomJoke);
            }
            
        });
    }
});

function fetchJoke(cb){
    https.get(apiUrl, response =>{
        response.on("data", chunk => {
            let joke = JSON.parse(chunk.toString());
            if(joke.type === "twopart"){
                console.log("setup: ", joke.setup);
                console.log("delivery: ", joke.delivery);
                return cb(null, `\n Coder1: ${joke.setup} \n Coder2: ${joke.delivery} \n`)
            }
            if(joke.type === "single"){
                console.log("joke: ", joke.joke);
                return cb(null, `\n Coder: ${joke.joke} \n`)
            }
        });
        response.on("error", err => {
            console.log("error: ", err);
            return cb(err);
        });
    });
}

client.login(process.env.TOKEN);