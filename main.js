const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client({disableEveryone: true});
let counterChannelId = JSON.parse(fs.readFileSync("./data/superC.json")).counter.countChannelId;
let lastMessageId = JSON.parse(fs.readFileSync("./data/superC.json")).counter.lastMessageId;

client.once("ready", async () => {
    console.log(`Logged as ${client.user.username}. Tag: ${client.user.tag}`);

    let msgs = new Discord.Collection();
    msgs = await client.channels.cache.get(counterChannelId).messages.fetch({after: lastMessageId});
    msgs = msgs.array().sort((a,b) => b.createdTimestamp - a.createdTimestamp).reverse();
    for(let msg of msgs) {
        await require("./counter")(client, msg, msg.content.trim().split(" "), JSON.parse(fs.readFileSync("./data/superC.json")), fs);
    }
});

client.on("message", async msg => {
    if(msg.author.bot) return undefined;
    let args = msg.content.trim().split(" ");
    if(msg.channel.id === counterChannelId) {
        const data = JSON.parse(fs.readFileSync("./data/superC.json"));
        await require("./counter")(client, msg, args, data, fs);
    }
});

client.login(process.env.BOT_TOKEN);
