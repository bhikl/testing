import fetch from "node-fetch";
import mysql from "mysql2/promise";

var connection;

class Db {
    async init_Db() {
        try{
            connection = await mysql.createConnection({
                host     : process.env.ADR,
                user     : process.env.USR,
                password : process.env.PSWD,
                port     : 31409
            });
            await connection.connect();
            await connection.query("CREATE DATABASE IF NOT EXISTS beatles;");
            await connection.query("USE beatles;");
            await connection.query("CREATE TABLE IF NOT EXISTS items"+
                        "(id INT PRIMARY KEY AUTO_INCREMENT,kind VARCHAR(30),"+
                        "collectionName VARCHAR(255),"+
                        "trackName VARCHAR(255), collectionPrice FLOAT,"+
                        "trackPrice FLOAT, primaryGenreName VARCHAR(30),"+
                        "trackCount TINYINT UNSIGNED, trackNumber TINYINT UNSIGNED,"+
                        "releaseDate DATETIME);");
        } catch(err) {
            console.log(err);
        }
    }
    async fetch_data(){
        try{
            var albumsList, songs;
            let response = await fetch("https://itunes.apple.com/search?term=The+Beatles&entity=album&attribute=allArtistTerm&limit=200");
            if (response.ok) {
                albumsList = await response.json();
            } else {
                alert("Error HTTP: " + response.status);
            }
            for (const album of albumsList.results) { 
                response = await fetch("https://itunes.apple.com/lookup?id="+album.collectionId+"&entity=song");
                if (response.ok) {
                    songs = await response.json();
                } else {
                    alert("Error HTTP: " + response.status);
                }
                for (const song of songs.results) {
                    if(song.trackName != null){
                        var sql = "INSERT INTO items "+
                            "(kind, collectionName,"+
                            "trackName, collectionPrice,"+
                            "trackPrice, primaryGenreName,"+
                            "trackCount, trackNumber, releaseDate)"+
                            " SELECT kind, collectionName,"+
                            "trackName, collectionPrice,"+
                            "trackPrice, primaryGenreName,"+
                            "trackCount, trackNumber, releaseDate FROM (SELECT "+
                            "? as kind, ? as collectionName, ? as trackName, ? as collectionPrice,"+
                            " ? as trackPrice, ? as primaryGenreName, ? as trackCount, ? as trackNumber, ? as releaseDate) AS temp "+
                            "WHERE NOT EXISTS ("+
                            "SELECT trackName FROM items "+
                            "WHERE trackName = ? and collectionName = ?) LIMIT 1;";
                        var inserts = [song.kind, song.collectionName, song.trackName,
                            song.collectionPrice, song.trackPrice, song.primaryGenreName,
                            song.trackCount, song.trackNumber, Db.toTimestamp(song.releaseDate), song.trackName, song.collectionName];
                        sql = mysql.format(sql, inserts);
                        await connection.query(sql);
                    }
                }
            }
        } catch(err) {
            console.log(err);
        }
    }
    async fetch_rows()  {
        try{
            const [rows,] = await connection.query("SELECT  * FROM items ORDER BY releaseDate ASC;");
            return rows;
        } catch(err) {
            console.log(err);
        }
    }
    static toTimestamp(strDate) {
        const dt = new Date(strDate);  
        return dt;
    }  
}
export {Db};