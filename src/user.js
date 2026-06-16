import { fetchPuuid, fetchLevel, fetchLeaugeEntries } from './api.js';
export default class User {
	constructor(gameName, tagLine, server) {
		this.puuid = null;
		this.gameName = gameName;
		this.tagLine = tagLine;
		this.server = server;
		
		// Data that we want
		this.lvl = 0;
		this.rankData = null; // obj {tier, wins, losses}
		this.gamesCount = 0;
		this.wins = 0;
		this.losses = 0;
	}

	async getPuuid() {
		this.puuid = await fetchPuuid(this.gameName, this.tagLine, this.server);
	}

	async updateLevel() {
		this.level = await fetchLevel(this.puuid, this.server);
	}

	async updateRank() {
		this.rankData = await fetchLeaugeEntries(this.puuid, this.server);
	}

	async updateMatches() {
		
	}
}
