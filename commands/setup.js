const { botId, prefix } = require('../config.json');
const constants = require('../constants');

module.exports = {
    name: 'setup',
    aliases: ['setup'],
    description: 'Setup channels!',
    guildOnly: true,
    args: false,
    usage: `${prefix}setup`,
	execute(message, args, client) {
        guild = message.guild;
        guildManager = guild.channels;
        let existingCategory = guildManager.cache.find(channel => channel.name === 'Mafia')
        if(existingCategory) {
            existingCategory.children.forEach(channel => channel.delete())
            existingCategory.delete()
        }
        guildManager.create('Mafia', {'type':'category'})
            .then(category => {
                guildManager.create('Discussion', {
                    'type': 'text',
                    'topic': 'Where day time discussions take place',
                    'parent': category
                })
                guildManager.create(constants.MAFIA, {
                    'type': 'text',
                    'topic': constants.MAFIA + ' kill discussions',
                    'permissionOverwrites' : [
                        {
                            'id': guild.roles.everyone.id,
                            'deny': ['VIEW_CHANNEL']
                        },
                        {
                            'id': botId,
                            'allow': ['VIEW_CHANNEL']
                        }
                    ],
                    'parent': category
                })
                guildManager.create(constants.SPY, {
                    'type': 'text',
                    'topic': 'Spy on the mafia!',
                    'permissionOverwrites' : [
                        {
                            'id': guild.roles.everyone.id,
                            'deny': ['VIEW_CHANNEL']
                        },
                        {
                            'id': botId,
                            'allow': ['VIEW_CHANNEL']
                        }
                    ],
                    'parent': category
                })
                guildManager.create(constants.JOKER, {
                    'type': 'text',
                    'topic': 'Be random!',
                    'permissionOverwrites' : [
                        {
                            'id': guild.roles.everyone.id,
                            'deny': ['VIEW_CHANNEL']
                        },
                        {
                            'id': botId,
                            'allow': ['VIEW_CHANNEL']
                        }
                    ],
                    'parent': category
                })
                guildManager.create(constants.HEALER, {
                    'type': 'text',
                    'topic': constants.HEALER + ' decisions',
                    'permissionOverwrites' : [
                        {
                            'id': guild.roles.everyone.id,
                            'deny': ['VIEW_CHANNEL']
                        },
                        {
                            'id': botId,
                            'allow': ['VIEW_CHANNEL']
                        }
                    ],
                    'parent': category
                })
                guildManager.create(constants.COP, {
                    'type': 'text',
                    'topic': constants.COP + ' decisions',
                    'permissionOverwrites' : [
                        {
                            'id': guild.roles.everyone.id,
                            'deny': ['VIEW_CHANNEL']
                        },
                        {
                            'id': botId,
                            'allow': ['VIEW_CHANNEL']
                        }
                    ],
                    'parent': category
                })
                guildManager.create(constants.SILENCER, {
                    'type': 'text',
                    'topic': constants.SILENCER + ' decisions',
                    'permissionOverwrites' : [
                        {
                            'id': guild.roles.everyone.id,
                            'deny': ['VIEW_CHANNEL']
                        },
                        {
                            'id': botId,
                            'allow': ['VIEW_CHANNEL']
                        }
                    ],
                    'parent': category
                })
                guildManager.create('Voice', {
                    'type': 'voice',
                    'parent': category
                })
            })
            .catch(error => console.log(error));
        
	},
};