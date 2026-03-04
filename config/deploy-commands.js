const path = require('path')
require('dotenv').config();
const { SlashCommandBuilder, Routes } = require('discord.js');
const {REST} = require('@discordjs/rest');
const { clientID, guildID } = require('./config.json');

const commands = [
    //new SlashCommandBuilder().setName('test')//test
    //    .setDescription('test commands'),

//roles
    new SlashCommandBuilder().setName('roles') //Display roles for users to add
        .setDescription('User Assignable Roles')
        .addSubcommand( sub => 
            sub
                .setName('add')
                .setDescription('Add yourself to new roles')
            )
        .addSubcommand( sub => 
            sub
                .setName('remove')
                .setDescription('Remove yourself from roles')
            )
        .addSubcommand( sub =>
            sub
                .setName('list')
                .setDescription('List roles that you can manage')
            ),

//ip stats
    new SlashCommandBuilder().setName('ip') //ip stats
        .setDescription('IP Lookup')
        .addStringOption( option =>
            option
                .setName('ip')
                .setDescription('Ip Address to lookup')
                .setRequired(true)
        )
        .addStringOption( option =>
            option
                .setName('private')
                .setDescription('Should results be private (ephemeral)? Default is yes.')
                .addChoices(
                    {name: "yes",   value: "yes"},
                    {name: "no",    value: "no"}
                )
        ),

//Help        
    new SlashCommandBuilder().setName('help') //HELP
        .setDescription('Display a help message')
        .addStringOption( option =>
            option
                .setName('private')
                .setDescription("Should results be private (ephemeral)?  Default is yes.")
                .addChoices(
                    {name: "yes",   value: "yes"},
                    {name: "no",    value: "no"}
                )
    ),

//rules    
    new SlashCommandBuilder().setName('rules') //RULES
        .setDescription('Display rules.')
        .addStringOption( option =>
            option
                .setName('private')
                .setDescription("Should results be private (ephemeral)?  Default is yes.")
                .addChoices(
                    {name: "yes",   value: "yes"},
                    {name: "no",    value: "no"}
                )
        ),

//runHelp
new SlashCommandBuilder()
    .setName('run_help')
    .setDescription('Show how to run code with the execution bot'),

//stats        
    new SlashCommandBuilder().setName('stats') //STATS
        .setDescription('Display server or user stats')
        .addSubcommand(sub =>
            sub
                .setName('server')
                .setDescription('Display server statistics')
                .addStringOption( option =>
                    option
                        .setName('private')
                        .setDescription("Should results be private?  Default is yes.")
                        .addChoices(
                            {name: "yes",   value: "yes"},
                            {name: "no",    value: "no"}
                        )
                )
        )
        .addSubcommand(sub =>
            sub
                .setName('user')
                .setDescription('Display user statistics')
                .addUserOption(option =>
                    option
                        .setName('target')
                        .setDescription('Select user')
                        .setRequired(true)
                )
                .addStringOption( option =>
                    option
                        .setName('private')
                        .setDescription("Should results be private (ephemeral)?  Default is yes.")
                        .addChoices(
                            {name: "yes",   value: "yes"},
                            {name: "no",    value: "no"}
                        )
                )
        ),

//poll        
    new SlashCommandBuilder().setName('poll') //POLL
        .setDescription("Create a poll.")
        .addStringOption((option) =>
            option
                .setName("question")
                .setDescription("Question for the poll")
                .setRequired(true)
    ),
//////ADMIN COMMANDS//////
//roleManager
    new SlashCommandBuilder().setName('rolemanager') //Add user assignable Roles
        .setDescription("Allows the admin to define user assignable roles for use in /roles")
        .addSubcommand( sub =>
            sub
                .setName('list')
                .setDescription('List roles that are currently set')
            )
        .addSubcommand( sub => 
            sub
                .setName('add')
                .setDescription('Add new roles to the user assignable list')
            )
        .addSubcommand( sub => 
            sub
                .setName('remove')
                .setDescription('Remove roles from the user assignable list')
        ),
    
//delete
    new SlashCommandBuilder().setName('delete') //DELETE
        .setDescription('Bulk delete up to 99 messages no older than 14 days. (Staff use only)')
        .addNumberOption((option) =>
            option
                .setName('number')
                .setDescription('Number of messages to delete')
                .setRequired(true)                
        ),

//parrot
    new SlashCommandBuilder().setName('parrot') //PARROT
        .setDescription('Make the bot say something (Staff use only)')
        .addStringOption((option) =>
            option
                .setName('string')
                .setDescription('What should I say?')
                .setRequired(true)
        )
        .addChannelOption((option) =>
            option
                .setName('channel')
                .setDescription('What channel should I post In?  If left blank I will post in the current channel')
                .setRequired(false)
        ),  
]
    .map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.CLIENT_TOKEN)

//rest.put(Routes.applicationGuildCommands(clientID, guildID), { body: commands })
rest.put(Routes.applicationCommands(clientID), { body: commands })
    .then((data) => console.log('Successfully registered '+data.length+' application commands.'))
    .catch(console.error);

