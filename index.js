const axios = require("axios");
require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/wbot-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();

app.command("/wbot-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
`Available Commands:
/wbot-ping - Check bot latency
/wbot-help - Show this message
/wbot-catfact - Get a random cat fact
/wbot-joke - Get a random joke
/wbot-roll [number] - Roll a dice (defaults to 6 sides)`
  });
});

app.command("/wbot-catfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});

app.command("/wbot-joke", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({
      text:
`${response.data.setup}

${response.data.punchline}`
    });
  } catch (err) {
    await respond({ text: "Failed to fetch a joke." });
  }
});

app.command("/wbot-roll", async ({ command, ack, respond }) => {
  await ack();


  const sides = parseInt(command.text) || 6;
  

  if (sides <= 0) {
    await respond({ text: "Please provide a valid number greater than 0!" });
    return;
  }

  const result = Math.floor(Math.random() * sides) + 1;
  await respond({ text: `You rolled a d${sides} and got a *${result}* 🎲` });
});