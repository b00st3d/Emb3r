const { Events } = require("discord.js");
const {
  parseBlock,
  execute,
  sendResult,
  LANG_ALIASES,
  tracked,
} = require("../src/sandbox");

module.exports = {
  name: Events.MessageCreate,

  async execute(message) {
    if (message.author.bot || !message.guild) return;

    const parsed = parseBlock(message.content);
    if (!parsed) return;

    let [lang, code] = parsed;
    lang = LANG_ALIASES[lang];

    if (!lang) {
      await message.channel.send(
        "Unsupported language. Use python, javascript or java in the code block header.",
      );
      return;
    }

    await message.channel.sendTyping();

    let result;
    try {
      result = await execute(lang, code);
    } catch {
      await message.channel.send("Execution request failed.");
      return;
    }

    const botMsg = await sendResult(message.channel, result, lang);

    tracked.set(message.id, {
      created: Date.now(),
      lang,
      bot_msg_id: botMsg.id,
    });
  },
};
