const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE amica_keys (key TEXT)");

    const stmt = db.prepare("INSERT INTO amica_keys VALUES (?)");
    stmt.run("sd_sldfkjslkdfj;slk");
    stmt.finalize();

    const stmt2 = db.prepare("update amica_keys set key='Hello' where rowid=1")
    stmt2.finalize()
    db.each("SELECT rowid AS id, key FROM amica_keys", (err, row) => {
        console.log(row.id + ": " + row.key);
    });
});

db.close();
