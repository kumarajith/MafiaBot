const { botId, prefix } = require('../config.json');
const constants = require('../constants');

let gameInProgress = false;
let players = {
	'<userid>': {
        'name': 'username',
        'role': constants.CIVILIAN
    }
}
const requiredChannels = ['mafia', 'discussion', 'spy', 'healer', 'detective', 'silencer', 'Voice']
let guild;
let channels = {

}
module.exports = {
    name: 'play',
    aliases: ['play', 'start'],
    description: 'Start the game! or restart it!',
    guildOnly: true,
    args: false,
    usage: `${prefix}<play|start> [restart]`,
    reset() {
        Object.keys(channels).forEach(async (name) => {
            if (name == 'discussion' || name == 'Voice') {
                return;
            }
            await channels[name].overwritePermissions([
                {
                    'id': guild.roles.everyone.id,
                    'deny': ['VIEW_CHANNEL']
                },
                {
                   'id': botId,
                   'allow': ['VIEW_CHANNEL'],
                }
            ]);
            await channels[name].bulkDelete(100)
                .catch(console.error);
            channels[name].send("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        })
    },
	async execute(message, args, client) {
        const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
        guild = message.guild;
        guildManager = guild.channels;
        if(args.length == 0 && gameInProgress) {  
		    return message.reply('Game already in progress! End game to start a new one.');
        }
        gameInProgress = true;
        mafiaCategory = guildManager.cache.find(channel => ((channel.name == 'Mafia') && (channel.type == 'category')))
        if(!mafiaCategory) {
		    return message.reply('Mafia category not found. Please run ' + prefix + 'setup');
        }
        mafiaCategory.children.forEach(channel => {channels[channel.name] = channel})
        channelKeys = Object.keys(channels)
        diff = requiredChannels.filter(x => !channelKeys.includes(x));
        if (diff.length > 0) {
		    return message.reply('Channels not found. Please run ' + prefix + 'setup');
        }
        message.channel.send('Starting new game');
        this.reset()
        //TODO:restructure code for fetching users
        //Clean channels and Remove permissions after ending the game
        Object.keys(players).forEach(async (userId) => {
            currentPlayer = players[userId]
            currentPlayer['user'] = client.users.cache.get(userId)
            currentPlayer['user'].send("Your role is " + currentPlayer['role'])
            if (currentPlayer['role'] == constants.CIVILIAN) {
                return;
            }
            await channels[currentPlayer['role']].createOverwrite(userId, {
                VIEW_CHANNEL: true
            });
        });
        message.channel.send('All of you have been assigned roles, Please check your DMs. \nYou will have access to text channel corresponding to your role.');
        message.channel.send('Game starting in 10 seconds. Get ready!');
        await wait(10000)
        while (gameInProgress) {
            message.channel.send('Night time begins!');
            await wait(100000)
        }
	},
};