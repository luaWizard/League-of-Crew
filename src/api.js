const API_KEY = "RGAPI-e1da4c48-f469-49a7-987f-4d9d61f9a339";




const API_REGION_ENUM = {
	EUROPE: "europe",
	AMERICAS: "americas",
	ASIA: "asia",
	SEA: "sea",
};

export const API_SERVER_ENUM = {
	BR1: "br1",
	EUN1: "eun1",
	EUW1: "euw1",
	JP1: "jp1",
	KR: "KR",
	LA1: "la1",
	LA2: "la2",
	ME1: "me1",
	NA1: "na1",
	OC1: "oc1",
	RU: "ru",
	SG2: "sg2",
	TR1: "tr1",
	TW2: "tw2",
	VN2: "vn2",
};


export const API_MATCH_TYPE = {
	NORMAL: "normal",
	RANKED: "ranked",
	TUTORIAL: "tutorial",
	TOURNEY: "tourney",
}

function API_SERVER_2_REGION(server) {
	switch(server) {
		// americas
		case API_SERVER_ENUM.NA1:
		case API_SERVER_ENUM.BR1:
		case API_SERVER_ENUM.LA1:
		case API_SERVER_ENUM.LA2:
			return API_REGION_ENUM.AMERICAS;
		// europe
		case API_SERVER_ENUM.EUN1:
		case API_SERVER_ENUM.EUW1:
		case API_SERVER_ENUM.ME1:  // xD?!
		case API_SERVER_ENUM.TR1:
		case API_SERVER_ENUM.RU:
			return API_REGION_ENUM.EUROPE;
		default:
				console.warn(`[WARNING]: Unknown server mapping for "${server}". Defaulting to AMERICAS.`);
				return API_REGION_ENUM.AMERICAS;
	}	
}


export async function fetchPuuid(gameName, tagLine, server) {
	const region = API_SERVER_2_REGION(server);
	console.log(region);
	const url = `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}?api_key=${API_KEY}`;
	try {
		const response = await fetch(url);
		if (!response.ok) {
			console.log(`❌ [${gameName}#${tagLine}] Error: ${response.status}`);
			return null;
		}
		const data = await response.json();
		console.log(`✅ [${gameName}#${tagLine}] PUUID: ${data.puuid}`);
		return data.puuid;
	}	catch(error) {
		console.log(`❌ [${gameName}#${tagLine}] Request failed: ${error.message}`);
		return null;
	}
}


export async function fetchLevel(puuid, server) {
	const url = `https://${server}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${API_KEY}`;
	try {
		const response = await fetch(url);   
		if (!response.ok) {
			console.log(`❌ [${puuid}] Error: ${response.status}`);
			return null;			
		}
		const data = await response.json();
		console.log(`✅ [${puuid}] Level: ${data.summonerLevel}`);
		return data.summonerLevel;
		
	} 	catch(error) {
		console.log(`❌ [${puuid}] Request failed: ${error.message}`);
		return null;
	}
}

export async function fetchLeaugeEntries(puuid, server) {
	const url = `https://${server}.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}?api_key=${API_KEY}`;
	try {
		const response = await fetch(url);
		if (!response.ok) {
			console.log(`❌ [${puuid}] Error: ${response.status}`);
			return null;
		}
		const data = await response.json();
		console.log(`✅ [${puuid}] Leauge: ${data[0]}`);
		console.log(data[0])
		const rankData = {
			tier: `${data[0].tier} ${data[0].rank} ${data[0].leaguePoints}LP`,
			total: data[0].wins + data[0].losses, 
			wins: data[0].wins,
			losses: data[0].losses,
		};
		return rankData;
	}	catch(error) {
		console.log(`❌ [${puuid}] Request failed: ${error.message}`);
		return null;
	}
}



export async function fetchMatches(puuid, server, start = 0, count = 20, type = null) {
	const region = API_SERVER_2_REGION(server);
	const type_param = (type == null) ? "" : `type=${type}&`;
	const url = `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?${type_param}start=${start}&count=${count}&api_key=${API_KEY}`;
	try {
		const response = await fetch(url);
		if (!response.ok) {    
			console.log(`❌ [${puuid}] Error: ${response.status}`);    
			return null;
		}
		const data = await response.json();   
		console.log(`✅ [${puuid}] Level: ${data}`);
		console.log(data);
		return data;
	}	catch(error) {
		console.log(`❌ [${puuid}] Request failed: ${error.message}`);
		return null;
	}
}

export async function fetchMatchId(server, matchId) {
	const region = API_SERVER_2_REGION(server);
	const url = `https://${region}.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${API_KEY}`;
	try {
		const response = await fetch(url);   
		if (!response.ok) {
				console.log(`❌ [${matchId}] Error: ${response.status}`);
		}
		const data = await response.json();   
		console.log(`✅ [${matchId}] Match: ${data}`);   
		console.log(data);   
		return data;
	} catch (error) {
		console.log(`❌ [${matchId}] Request failed: ${error.message}`);
		return null;
	}
}


export async function fetchMatchesId(server, matches) {
	const _matches = [];
	for(var i=0; i < matches.length; i++) {
		_matches[i] = await fetchMatchId(server, matches[i]);
	}
	return _matches;
}


export function fetchSummonerFromMatch(user, match) {
		// console.log(`match: ${match}`);
		const metadata = match.metadata;
		const summoners = metadata.participants;
		var summoner;
		// console.log(summoners);

		for(var i=0; i <= summoners.length; i++) {
			if(summoners[i] == user.puuid)
				summoner = i;
		}		
		// console.log(summoner);

		const info = match.info;
		const summonerData =  info.participants[summoner];
		console.log(info);
		console.log(summonerData);
		return {
			summoner: summonerData,
			assists: summonerData["assists"],
			kills: summonerData["kills"],
			deaths: summonerData["deaths"],
			kda: (summonerData["deaths"] == 0) ? "Perfect" : ((summonerData["kills"] + summonerData["assists"]) / summonerData["deaths"]).toFixed(1),
			victory: summonerData["win"],
			mode: info.gameMode,
		}
}


export function fetchSummonerFromMatches(user, matches) {
	const summonerMatches = [];
	for(var i=0; i < matches.length; i++) {
		console.log(matches[i]);
		summonerMatches[i] = fetchSummonerFromMatch(user, matches[i]);
	}
	return summonerMatches;
}


export function calcSummonerDataFromMatches(summonerMatchData) {
	// kda: (summonerData["deaths"] == 0) ? "Perfect" : ((summonerData["kills"] + summonerData["assists"]) / summonerData["deaths"]).toFixed(1),
	var kills = 0;
	var assists = 0;
	var deaths = 0;
	var wins = 0;
	var losess = 0;
	var winrate = 0;
	var totalGames = summonerMatchData.length;
	
	for(var i=0; i<summonerMatchData.length; i++) {
		kills += summonerMatchData[i].kills;
		assists += summonerMatchData[i].assists;
		deaths += summonerMatchData[i].deaths;
		wins += (summonerMatchData[i].victory) ? 1 : 0;
	}
	losess = totalGames - wins;
	winrate = wins / totalGames * 100;
	var kda = (deaths == 0) ? "Perfect" : ((kills + assists) / deaths).toFixed(1);
	console.log(kda, kills, assists, deaths, winrate, wins, losess);
}
