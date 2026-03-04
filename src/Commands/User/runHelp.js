const { EmbedBuilder } = require("discord.js");

async function runHelp(interaction) {
  const content =
    "Run code by sending a message that starts with `/run` followed by a fenced code block.\n\n" +
    "**Format:**\n" +
    "/run ```<language>\n" +
    "your code here\n" +
    "```\n" +
    "Language support: **python**, **javascript**, **java** (**py**,**js** also works)\n\n" +
    "### Examples\n" +
    "**Python:**\n\n" +
    "/run ```python\n" +
    "print(1 + 1)\n" +
    "```\n" +
    "**JavaScript:**\n\n" +
    "/run ```javascript\n" +
    "console.log(1 + 1)\n" +
    "```\n" +
    "**Java:**\n\n" +
    "/run ```java\n" +
    "public class Main {\n" +
    "    public static void main(String[] args) {\n" +
    "        System.out.println(1 + 1);\n" +
    "    }\n" +
    "}\n" +
    "```\n\n" +
    "You can edit your message within 2 minutes to re-run the code automatically.";

  const embed = new EmbedBuilder()
    .setTitle("How to Run Code")
    .setDescription(content)
    .setColor(0x2b2d31);

  await interaction.reply({ embeds: [embed] });
}

module.exports.runHelp = runHelp;
