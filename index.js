const Discord = require('discord.js');
const https = require('https');
require('dotenv').config();

// Add necessary intents here
const { GatewayIntentBits } = require('discord.js');

const client = new Discord.Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const apiUrl = "https://v2.jokeapi.dev/joke/Programming?safe-mode";

client.on("ready", () => {
  console.log(`Log In Successful, Client is ${client.user.tag}`);
});

client.on("messageCreate", msg => {  // Changed from "message" to "messageCreate" for Discord.js v13+
  if (msg.content === "joke" || msg.content === "funny") {
    fetchJoke((err, randomJoke) => {
      if (err) {
        msg.reply(`Try Again Later Alligator!`);
      } else {
        msg.reply(randomJoke);
      }
    });
  }
});

function fetchJoke(cb) {
  https.get(apiUrl, response => {
    let data = '';
    response.on("data", chunk => {
      data += chunk;
    });
    response.on("end", () => {
      let joke = JSON.parse(data);
      if (joke.type === "twopart") {
        console.log("setup: ", joke.setup);
        console.log("delivery: ", joke.delivery);
        return cb(null, `Test\n Coder1: ${joke.setup} \n Coder2: ${joke.delivery}`);
      }
      if (joke.type === "single") {
        console.log("joke: ", joke.joke);
        return cb(null, "Test\n" + joke.joke);
      }
    });

    response.on("error", err => {
      console.error(err);
      return cb(err);
    });
  });
}

client.login(process.env.TOKEN);
