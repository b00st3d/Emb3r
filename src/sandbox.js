const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const githubRow = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setLabel("Star on GitHub")
    .setStyle(ButtonStyle.Link)
    .setURL("https://github.com/Ryuga/Hermes/")
    .setEmoji("⭐"),
);

const EXECUTE_URL = process.env.EXECUTE_URL;

const LANG_ALIASES = {
  py: "python",
  python: "python",
  js: "javascript",
  javascript: "javascript",
  java: "java",
};

const tracked = new Map();

function parseBlock(content) {
  if (!content.startsWith("/run")) return null;
  if (!content.includes("```")) return null;

  try {
    const block = content.split("```")[1];
    const blockContent = block.split("```")[0];

    const lines = blockContent.split("\n");
    const lang = lines[0].trim().toLowerCase();
    const code = lines.slice(1).join("\n");

    if (!lang || !code.trim()) return null;

    return [lang, code];
  } catch {
    return null;
  }
}

async function execute(language, code) {
  const payload = { language, code };

  const resp = await fetch(EXECUTE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (resp.status === 429) {
    return {
      code: -1,
      output: "",
      std_log: "Rate limit exceeded. Please wait before executing again.",
      rate_limited: true,
    };
  }

  if (resp.status === 503) {
    return {
      code: -1,
      output: "",
      std_log: "Engine is currently under maintenance. Please try again later.",
      maintenance: true,
    };
  }

  if (resp.status >= 500) {
    return {
      code: -1,
      output: "",
      std_log: "Execution engine temporarily unavailable.",
      unavailable: true,
    };
  }

  return await resp.json();
}

function buildOutput(result) {
  const exitCode = result.code;
  const stdout = result.output || "";
  const stderr = result.std_log || "";

  let combined = stdout;

  if (exitCode !== 0 && stderr) {
    combined = combined ? combined + "\n" + stderr : stderr;
  }

  if (!combined) combined = "(no output)";

  if (combined.length > 1900)
    combined = combined.slice(0, 1900) + "\n... (truncated)";

  return [exitCode, combined];
}

function codeEvalEmbed(language, output, edited = false, exit_code = -1) {
  let suffix = language === "java" ? "〖beta〗" : "";

  const title = edited
    ? "Execution Result (edited)"
    : "Execution Result" + suffix;

  const color = exit_code !== 0 ? 0x8b0000 : edited ? 0x00ff00 : 0x006400;

  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(`\`\`\`ex\n${output}\`\`\``)
    .setColor(color)
    .setFooter({
      text: "Powered by Hermes Engine",
      iconURL: `https://lairesit.sirv.com/Tortoise/${language}.png`,
    });

  return embed;
}

function failure(message) {
  return new EmbedBuilder().setDescription(`❌︱${message}`).setColor(0xff0000);
}

async function sendResult(channel, result, language, opts = {}) {
  const { edited = false, targetMessage = null } = opts;

  const [exitCode, output] = buildOutput(result);

  let embed;

  if (result.rate_limited || result.maintenance || result.unavailable) {
    embed = failure(result.std_log);
  } else {
    embed = codeEvalEmbed(language, output, edited, exitCode);
  }

  if (targetMessage) {
    await targetMessage.edit({ embeds: [embed], components: [githubRow] });
    return targetMessage;
  }

  return await channel.send({ embeds: [embed], components: [githubRow] });
}

module.exports = {
  parseBlock,
  execute,
  sendResult,
  LANG_ALIASES,
  tracked,
};
