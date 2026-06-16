import { API_SERVER_ENUM, fetchMatches, fetchMatchId, fetchMatchesId,  API_MATCH_TYPE, fetchSummonerFromMatch, fetchSummonerFromMatches, calcSummonerDataFromMatches } from './api.js';
import User from './user.js';

const accounts = [
	{ gameName: "nissanGTR910", tagLine: "DRIVE", server: API_SERVER_ENUM.EUN1},
	{ gameName: "ArkhamNinja", tagLine: "EUNE", server: API_SERVER_ENUM.EUN1},
	{ gameName: "ArkhamSpartan", tagLine: "EUNE", server: API_SERVER_ENUM.EUN1},
	{ gameName: "nissanGTR910", tagLine: "DRIVE", server: API_SERVER_ENUM.EUN1},
]

const index = 0;
const usr = new User(accounts[index].gameName, accounts[index].tagLine, accounts[index].server);



await usr.getPuuid();
await usr.updateLevel();
await usr.updateRank();

 
console.log(usr);
// console.log(usr.level);
// console.log(usr.rankData);


const matches = await fetchMatches(usr.puuid, usr.server, 0, 20, null);
const matches2 = await fetchMatchesId(usr.server, matches);
// const match = await fetchMatchId(accounts[index].server, matches[0]);

const summoner = fetchSummonerFromMatches(usr, matches2);
console.log(summoner);
calcSummonerDataFromMatches(summoner);
