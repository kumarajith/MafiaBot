const { botId, prefix } = require('../config.json');
const constants = require('../constants');

let gameInProgress = false;
let players = {
    '<userid>': {
        'name': 'username',
        'role': constants.CIVILIAN,
        'state': constants.ALIVE
    }
}
const requiredChannels = ['mafia', 'discussion', 'spy', 'joker', 'healer', 'detective', 'silencer', 'Voice']
const emojiMap = ['1⃣','2⃣','3⃣','4⃣','5⃣','6⃣','7⃣','8⃣','9⃣','🔟'];
let guild;
let channels = {}
let healList = []
let killList = []
let silenceList = []
module.exports = {
    name: 'play',
    aliases: ['play', 'start'],
    description: 'Start the game! or restart it!',
    guildOnly: true,
    args: false,
    usage: `${prefix}<play|start> [restart]`,
    async reset() {
        promisesList = [];
        Object.keys(channels).forEach((name) => {
            if (name == 'discussion' || name == 'Voice') {
                return;
            }
            promisesList.push(channels[name].overwritePermissions([
                {
                    'id': guild.roles.everyone.id,
                    'deny': ['VIEW_CHANNEL']
                },
                {
                   'id': botId,
                   'allow': ['VIEW_CHANNEL'],
                }
            ]))
            promisesList.push(channels[name].bulkDelete(100))
            channels[name].send("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        })
        await Promise.all(promisesList)
        console.log("Reset done")
    },
	async execute(message, args, client) {
        const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
        guild = message.guild;
        guildManager = guild.channels;
        if(args.length == 0 && gameInProgress) {  
		    return message.reply('Game already in progress! End game to start a new one.');
        }
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
        gameInProgress = true;
        message.channel.send('Starting new game');
        await this.reset()
        //TODO:restructure code for fetching users
        //Clean channels and Remove permissions after ending the game
        //Handle alive dead cases
        Object.keys(players).forEach(async (userId) => {
            currentPlayer = players[userId]
            currentPlayer['user'] = client.users.cache.get(userId)
            // currentPlayer['user'].send("Your role is " + currentPlayer['role'])
            if (currentPlayer['role'] == constants.CIVILIAN) {
                return;
            }
            await channels[currentPlayer['role']].createOverwrite(userId, {
                VIEW_CHANNEL: true
            });
        });
        message.channel.send('All of you have been assigned roles, Please check your DMs. \nYou will have access to text channel corresponding to your role.');
        message.channel.send('Game starting in 10 seconds. Get ready!');
        // await wait(10000)
        while (gameInProgress) {
            message.channel.send('Night time begins! You have 30 seconds');
            this.getHealedPlayers()
            await wait(40000)
            message.channel.send('Day time begins! You have 60 seconds!');
            await wait(60000)
        }
    },
    getHealedPlayers() {
        messageText = "Who do you wish to heal?";
        counter = 1;
        playerKeys = Object.keys(players)
        playerKeys.forEach(userId => {
            player = players[userId]
            if (player.state == constants.ALIVE) {
                messageText += "\n" + counter++ + ". " + player.name
            }
        });
        channels[constants.HEALER].send(messageText)
            .then (reactionMessage => {
                reactionMessage.awaitReactions(this.reactionFilter, { max: 1, time: 30000, errors: ['time'] })
                    .then(collected => {
                        reaction = collected.first()
                        emojiIndex = emojiMap.indexOf(reaction.emoji.name)
                        playerKey = playerKeys[emojiIndex];
                        healList.push(playerKey)
                        console.log("Healed " + players[playerKey].name)
                    })
                    .catch(collected => {
                        //TODO:No votes received, pick random target to heal or dont heal anyone
                        console.log("No heals")
                    });
                for (let index = 0; index < counter - 1; index++) {
                    reactionMessage.react(emojiMap[index])
                }
            })
            .catch(error => console.log(error))
    },
    reactionFilter : (reaction, user) => {
        return emojiMap.includes(reaction.emoji.name) && user.id != botId;
    }
};