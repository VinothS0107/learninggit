const express = require("express");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
const initializeDBandServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Server is started Successfully");
    });
  } catch (e) {
    console.log(`Error:${e.message}`);
    process.exit(1);
  }
};

initializeDBandServer();
//API 1
app.get("/players/", async (request, response) => {
  const databaseDetails = `
  SELECT 
   *
  FROM
   cricket_team`;
  const listArray = await db.all(databaseDetails);
  response.send(listArray);
});

//API 2
app.post("/players/", async (request, response) => {
  const playersDetails = request.body;
  const { playerName, jerseyNumber, role } = playersDetails;
  const addPlayerQuery = `
    INSERT INTO
    cricket_team (player_name ,jersey_number,role)
    VALUES
    ('${playerName}',
    ${jerseyNumber},
    '${role}')
    ;`;
  const dbResponse = await db.run(addPlayerQuery);
  const playerId = dbResponse.lastID;
  response.send("Player Added to Team");
});
//API 3
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayersQuery = `
    SELECT 
    *
    FROM cricket_team
    WHERE
    player_id=${playerId};`;

  const playersObject = await db.get(getPlayersQuery);
  response.send(playersObject);
});

//API 4
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playersDetails = request.body;
  const { playerName, jerseyNumber, role } = playersDetails;
  const updatePlayersDetails = `
    UPDATE
     cricket_team
    SET 
      player_name= '${playerName}',
      jersey_number=${jerseyNumber},
      role='${role}'
    WHERE
      player_id=${playerId};`;
  await db.run(updatePlayersDetails);
  response.send("Player Details Updated");
});

//API 5 Delete
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerDetails = `
    DELETE FROM 
        cricket_team 
    WHERE 
       player_id=${playerId};`;
  await db.run(deletePlayerDetails);
  response.send("Player Removed");
});

module.exports = app;
