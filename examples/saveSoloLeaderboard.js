// This script will save a TETR.IO Solo leaderboard to "leaderboard.json"
// Credit to Turbo-baguette

const { TetraChannel } = require('../dist/index')
const fs = require('fs')

async function getLeaderBoard(country) {
  const res = await TetraChannel.leaderboards.tetra_league_full(country);
  return res.data.users;
}

async function getUserRecords(userId) {

  let sprintTime = null;
  let blitzScore = null;

  const res = await TetraChannel.users.records(userId);
 
  sprintTime = res.data.records["40l"].record.endcontext.finalTime
  blitzScore = res.data.records.blitz.record.endcontext.score

  return {
      sprint: sprintTime,
      blitz: blitzScore
  };
}

async function createSoloLeadderBoard() {
  var country = "" // Write the country code here

  let sprintLeaderboard = [];
  let blitzLeaderboard = [];

  const Players = (await getLeaderBoard(country));

  for (const player of Players) {
      const playerRecords = await getUserRecords(player["_id"]);
      console.log(`fetched records for player ${player.username}`);

      if (playerRecords.sprint) {
          sprintLeaderboard.push({
              player: player.username,
              time: playerRecords.sprint
          });
      }

      if (playerRecords.blitz) {
          blitzLeaderboard.push({
              player: player.username,
              score: playerRecords.blitz
          })
      }

  }

  sprintLeaderboard.sort((a, b) => a.time - b.time);
  blitzLeaderboard.sort((a, b) => b.score - a.score);

  return {
      sprintLeaderboard,
      blitzLeaderboard
  }

}

createSoloLeadderBoard().then(res => {
  fs.writeFile("leaderboard.json", JSON.stringify(res), err => {
      if (err) {
          console.log(err)
      }
  });
  console.log('all done :)');
}).catch(console.error);