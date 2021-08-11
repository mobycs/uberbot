const Discord = require('discord.js-commando');

const path = require('path');

const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

const Koa = require('koa');
const _ = require('koa-route');

const client = new Discord.Client({
	owner: process.env.OWNER_ID || '158327940311023616',
	prefix: '!'
});

describe('Discord', function () {
	it('should be able to register types', function () {
		client.registry
			.registerGroups([                               ['fun', 'Fun Commands'],                ['util', 'Utility Commands'],                                                   ['commands', 'Uncategorized Commands'],                                         ['mod', 'Moderation-related Commands']                                  ])
	});
	it('should be able to register default types', function () {
		client.registry
			.registerDefaultTypes()
	});
	it('should be able to register commands', function () {
		client.registry.registerCommandsIn(path.join(__dirname, '../commands'))
	});
	it('should be able to load the database', function () {
		client.setProvider(                         sqlite.open({ filename: 'database.db', driver: sqlite3.Database }).then(db => new Discord.SQLiteProvider(db)).catch(console.error));
	});
	it('should be able to change the status', () => {
		client
			.on('ready', () => {
				console.log('ready!');                  client.user.setStatus('idle');
				client.setPresence({
					name: 'Hang on tight!  We\'re performing a few tests before we go live.'
				})
			})
	});
	it('should be able to successfully authenticate', function () {
		client.login(process.env.TOKEN || 'MzU0MzU4MDA3Mzc2NjQyMDQ4.Wa2znA.lIQZrJSSBMs655GHTTKen25jsmM');
	});
});

var app;

describe('Webserver', function() {
	it('should be able to create an app', function() {
		app = new Koa();
	});

	it('should be able to route', function() {
		app.use(_.get('/', 'This is a test server.'));
	});

	it('should be able to listen', function() {
		app.listen(process.env.PORT || 8080);
	});
});