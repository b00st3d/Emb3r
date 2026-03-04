const { Events } = require("discord.js");
const {
  parseBlock,
  execute,
  sendResult,
  LANG_ALIASES,
  tracked,
} = require("../src/sandbox");

module.exports = {
  name: Events.MessageUpdate,

  async execute(before, after) {
    if (!after.author || after.author.bot || !after.guild) return;

    const meta = tracked.get(after.id);
    if (!meta) return;

    if (Date.now() - meta.created > 120000) {
      tracked.delete(after.id);
      return;
    }

    const parsed = parseBlock(after.content);
    if (!parsed) return;

    let [lang, code] = parsed;
    lang = LANG_ALIASES[lang];
    if (!lang) return;

    await after.channel.sendTyping();

    let result;
    try {
      result = await execute(lang, code);
    } catch {
      return;
    }

    let botMsg;
    try {
      botMsg = await after.channel.messages.fetch(meta.bot_msg_id);
    } catch {
      return;
    }

    await sendResult(after.channel, result, lang, {
      edited: true,
      targetMessage: botMsg,
    });
  },
};
