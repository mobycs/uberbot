const commando = require('discord.js-commando');
const Discord = require('discord.js');
const path = require('path');

const { MongoClient } = require('mongodb');
const { MongoDBProvider } = require('commando-provider-mongo');

const Koa = require('koa');
const _ = require('koa-route');
const app = new Koa();

const { oneLine } = require('common-tags');

const client = new commando.Client({
	owner: process.env.OWNER_ID || '158327940311023616',
	prefix: process.env.PREFIX || '!',
	mentionEveryone: true,
});


client.registry
	.registerGroups([
        	['fun', 'Fun Commands'],
		['util', 'Utility Commands'],
        	['commands', 'Uncategorized Commands'],
		['mod', 'Moderation-related Commands'],
		['notifications', 'Social Notifications']
	])
	.registerDefaultTypes()
    	.registerCommandsIn(path.join(__dirname, 'commands'));


client
	
	.on('ready', () => {
		console.log('ready!');
		client.user.setStatus('available');
		client.user.setActivity({
			name: `${client.guilds.cache.size} servers | do ${process.env.prefix || '!'}help`,
			type: 'STREAMING',
			url: 'https://uberbot.xyz'
		});
	})
	.on('disconnect', () => { console.warn('Disconnected!'); })
	.on('reconnecting', () => { console.warn('Reconnecting...'); })
	.on('commandError', (cmd, err) => {
		if(err instanceof commando.FriendlyError) return;
		console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
	})
	.on('commandBlocked', (msg, reason) => {
		console.log(oneLine`
			Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			blocked; ${reason}
		`);
	})
	.on('commandPrefixChange', (guild, prefix) => {
		console.log(oneLine`
			Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	})



app.use(_.get('/', async ctx => {
	ctx.body = 'Bot is up!'
}));

client.setProvider(
	MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(client => new MongoDBProvider(client, 'abot'))
).catch(console.error);

const TwitchNotifier = require('./notifier/twitch');
TwitchNotifier(client);

client.login(process.env.TOKEN);
app.listen(process.env.PORT || 5000);

