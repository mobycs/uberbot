function removeBrackets(str) {
	return str.replace(/[[\]\\]/g, '')
}

const urban = require('urban')

function urbanDictionary(str) {
	return new Promise((resolve, reject) => {
		urban(str).first(word => resolve(word));
	});
}

function delay(seconds) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve();
		}, seconds * 1000);
	});
}

const { ApiClient } = require('twitch');

const apiClient = ApiClient.withClientCredentials(process.env.CLIENT_ID, process.env.CLIENT_SECRET);

function getUser(name) {
	return apiClient.helix.users.getUserByName(name);
}

function getChannel(id) {
	return new Promise((resolve, reject) => {-
	
		Promise.all([
			apiClient.kraken.channels.getChannel(id),
                    apiClient.kraken.streams.getStreamByChannel(id)
		]).then(data => {
			resolve({...data[0], ...data[1]});
		});
	});
}

async function getStreams(users) {
	let map = [];

	for (let id of users) {
		let user = apiClient.helix.users.getUserById(id);
		map.push(new Promise(resolve => user.then(async user => resolve(await user))));
	}
	
	return map;
	
}

function getUsers(users) {
	return apiClient.helix.users.getUsersByIds(users)
}

function getStream(id) {
	return apiClient.kraken.streams.getStreamByChannel(id);
}

module.exports = {
	removeBrackets,
	urbanDictionary,
	delay,
	getUser,
	getChannel,
	getStreams,
	getUsers,
	getStream
}
