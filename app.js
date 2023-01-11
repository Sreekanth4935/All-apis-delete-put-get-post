//practice Code / solution

const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "cricketTeam.db");

const app = express();

app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
    SELECT
      *
    FROM
      cricket_team;`;
  const playersArray = await database.all(getPlayersQuery);
  response.send(
    playersArray.map((eachPlayer) =>
      convertDbObjectToResponseObject(eachPlayer)
    )
  );
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
    SELECT 
      * 
    FROM 
      cricket_team 
    WHERE 
      player_id = ${playerId};`;
  const player = await database.get(getPlayerQuery);
  response.send(convertDbObjectToResponseObject(player));
});

app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const postPlayerQuery = `
  INSERT INTO
    cricket_team (player_name, jersey_number, role)
  VALUES
    ('${playerName}', ${jerseyNumber}, '${role}');`;
  const player = await database.run(postPlayerQuery);
  response.send("Player Added to Team");
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const { playerId } = request.params;
  const updatePlayerQuery = `
  UPDATE
    cricket_team
  SET
    player_name = '${playerName}',
    jersey_number = ${jerseyNumber},
    role = '${role}'
  WHERE
    player_id = ${playerId};`;

  await database.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
  DELETE FROM
    cricket_team
  WHERE
    player_id = ${playerId};`;
  await database.run(deletePlayerQuery);
  response.send("Player Removed");
});
module.exports = app;

// const express = require("express");  //ownCode
// const app = express();

// const { open } = require("sqlite");
// const sqlite3 = require("sqlite3");

// app.use(express.json());

// const path = require("path");
// const dbPath = path.join(__dirname, "cricketTeam.db");

// let db = null;

// const intilizeDBAndServer = async () => {
//   try {
//     db = await open({
//       filename: dbPath,
//       driver: sqlite3.Database,
//     });
//     app.listen(3000, () => {
//       console.log("Server Running at http://localhost:3000/players/");
//     });
//   } catch (e) {
//     console.log(`Error: ${e.message}`);
//     process.exit(1);
//   }
// };
// intilizeDBAndServer();

// const convertDbObjectToResponseObject = (dbObject) => {
//   return {
//     playerId: dbObject.player_id,
//     playerName: dbObject.player_name,
//     jerseyNumber: dbObject.jersey_number,
//     role: dbObject.role,
//   };
// };

// app.get("/players/", async (request, response) => {
//   const getPlayersList = `
//     select * from cricket_team;
//     `;
//   const playersArray = await db.all(getPlayersList);

//   response.send(
//     playersArray.map((eachPlayer) =>
//       convertDbObjectToResponseObject(eachPlayer)
//     )
//   );
// });

// app.post("/players", async (request, response) => {
//   const playerDetails = request.body;

//   const { playerName, jerseyNumber, role } = playerDetails;
//   const addPlayerQuery = `
//   INSERT INTO
//   cricket_team
//   (player_name,jersey_number,role)
//   VALUES
//   ( '${playerName}',${jerseyNumber},'${role}' );`;

//   const dbResponse = await db.run(addPlayerQuery);
//   //   const newPlayerId = dbResponse.lastID;
//   response.send("Player Added to Team");
// });

// app.get("/players/:playerId/", async (request, response) => {
//   const { playerId } = request.params;
//   const getPlayerQuery = `
//     SELECT
//     *
//     FROM
//     cricket_team
//     WHERE
//     player_id = ${playerId};
//     `;
//   const playerDetails = await db.get(getPlayerQuery);
//   response.send(convertDbObjectToResponseObject(playerDetails));
// });

// app.put("/players/:playerId/", async (request, response) => {
//   const { playerId } = request.params;
//   const playerDetails = request.body;
//   const { playerName, jerseyNumber, role } = playerDetails;

//   const updateQuery = `
//   UPDATE cricket_team
//   SET
//     player_name='${playerName}',
//     jersey_number=${jerseyNumber},
//      role='${role}'
//    WHERE player_id = ${playerId};`;
//   const dbResponse = await db.run(updateQuery);
//   response.send("Player Details Updated");
//   //   response.send(dbResponse);
// });

// app.delete("/players/:playerId/", async (request, response) => {
//   const { playerId } = request.params;
//   const deletePlayerQuery = `
//     DELETE from
//     cricket_team
//     WHERE
//        player_id = ${playerId};
//     `;
//   await db.run(deletePlayerQuery);
//   response.send("Player Removed");
// });

// module.exports = app;
