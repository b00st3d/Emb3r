//directory of user commands

module.exports.createPoll = require('./User/poll.js').createPoll; //user, thumb, question
module.exports.addPollReactions = require('./User/poll.js').addReactions; //message
module.exports.rules = require('./User/rules.js').rulesEmbed; //message, cmd2, guild
module.exports.userStats = require('./User/stat.js').userStats; //message, cmd2, guild
module.exports.serverStats = require('./User/stat.js').serverStats; //guild
module.exports.help = require('./User/help.js').helpEmbed; 
module.exports.runHelp = require('./User/runHelp.js').runHelp;

module.exports.delete = require('./Admin/delete.js').del; //interaction, channel, number
module.exports.logger = require('./Admin/logger.js').logger; //guild, title, message
module.exports.ipStats = require('./User/ipStat.js').ipStats;
module.exports.storeNewUser = require('../Functions/userData.js').storeNewUser;
module.exports.deleteUser = require('../Functions/userData.js').deleteUser;
module.exports.checkUsers = require('../Functions/userData.js').checkUsers;

const roleData = require("../Functions/roleData.js")
module.exports.listRoles = roleData.listRoles; //gid,member,action,rid
module.exports.storeRole = roleData.storeRole; //roleName,roleID,guildID
module.exports.deleteRole = roleData.deleteRole; //gid,rid
module.exports.roleManager = require("./Admin/roleManager.js").roleManager; //subCommand,interaction,guild,member
module.exports.roles = require("./User/roles.js").roles; //subCommand,interaction,guild,member

module.exports.addRole = require("../Functions/addRole.js").addRole //guild,member,responses,interaction
module.exports.removeRole = require("../Functions/removeRole.js").removeRole //guild,member,responses,interaction

