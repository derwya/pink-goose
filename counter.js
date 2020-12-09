
module.exports = async function(client, msg, args, data, fs) {
    let countChannel = client.channels.cache.get(data.counter.countChannelId);
    await msg.delete({timeout: 500});
    let begining = args[0].replace(/\n.*/, "");
    if (
      begining == data.counter.nextNumber &&
      msg.author.id != data.counter.lastUserId
    ) {
      data.counter.nextNumber++;
      data.counter.lastUserId = msg.author.id;
      await countChannel
        .createWebhook(msg.author.username, {avatar: msg.author.avatarURL()})
        .then(async wb => {
          await wb.send(msg.content).then(async wbMsg => data.counter.lastMessageId = await wbMsg.id);
          console.log(data.counter.lastMessageId);
          wb.delete();
        })
        .catch(console.error);
      fs.writeFileSync(
        "./data/superC.json",
        JSON.stringify(data, null, "\t")
      );
    }
  };
  