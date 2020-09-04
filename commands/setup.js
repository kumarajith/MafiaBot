const { botId, prefix } = require('../config.json');
module.exports = {
    name: 'setup',
    aliases: ['setup'],
    description: 'Setup channels!',
    guildOnly: true,
    args: false,
    usage: `${prefix}setup`,
	execute(message, args) {
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
                guildManager.create('Mafia', {
                    'type': 'text',
                    'topic': 'Mafia kill discussions',
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
                guildManager.create('Spy', {
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
                guildManager.create('Healer', {
                    'type': 'text',
                    'topic': 'Healer decisions',
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
                guildManager.create('Detective', {
                    'type': 'text',
                    'topic': 'Detective decisions',
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
                guildManager.create('Silencer', {
                    'type': 'text',
                    'topic': 'Silencer decisions',
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