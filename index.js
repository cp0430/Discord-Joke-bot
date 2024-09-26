const { Client, GatewayIntentBits } = require('discord.js');
const { fetchJoke } = require('./jokeService');
const { PREFIX, TOKEN } = require('./config');
require('dotenv').config();
const rateLimit = new Map();  // Store last joke fetch time for users

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once("ready", () => {
  console.log(`Log In Successful, Client is ${client.user.tag}`);
});

client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;

  // Rate limiting: User can only request a joke once per 10 seconds
  const lastRequest = rateLimit.get(msg.author.id);
  const now = Date.now();
  
  if (lastRequest && (now - lastRequest) < 10000) {
    return msg.reply('Please wait before requesting another joke!');
  }

  // Check for commands starting with a specific prefix
  if (msg.content.startsWith(`${PREFIX}joke`) || msg.content.startsWith(`${PREFIX}funny`)) {
    try {
      rateLimit.set(msg.author.id, now);
      
      const randomJoke = await fetchJoke();
      const jokeEmbed = {
        color: 0x0099ff,
        title: "Here's a Programming Joke 🤖",
        description: randomJoke,
        timestamp: new Date(),
        footer: {
          text: `Requested by ${msg.author.tag}`,
        },
      };

      msg.channel.send({ embeds: [jokeEmbed] });
    } catch (error) {
      console.error('Error fetching joke:', error);
      msg.reply(`Sorry, couldn't fetch a joke right now. Try again later!`);
    }
  }
});

client.login(TOKEN);
