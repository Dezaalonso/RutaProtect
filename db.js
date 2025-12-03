let db = null;

// Initialize SQL.js and load/ create database
async function initDb(dbFile = null) {
  const SQL = await initSqlJs({
    locateFile: file => `https://sql.js.org/dist/${file}`
  });

  if (dbFile) {
    try {
      const res = await fetch(dbFile);
      const buf = await res.arrayBuffer();
      db = new SQL.Database(new Uint8Array(buf));
      console.log("DB loaded:", dbFile);
    } catch {
      console.log("DB not found, creating new...");
      db = new SQL.Database();
    }
  } else {
    db = new SQL.Database();
  }

  // Create users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      password TEXT
    );
  `);
  console.log("Users table ready");
}

// SELECT (returns rows)
function runQuery(sql) {
  try {
    const result = db.exec(sql);
    return result.length ? result[0].values : [];
  } catch (e) {
    console.error("Query error:", e);
    return [];
  }
}

// INSERT / UPDATE / DELETE
function runExec(sql) {
  try {
    db.run(sql);
  } catch (e) {
    console.error("Exec error:", e);
  }
}

// SAFE insert with prepared statement
function addUser(username, password) {
  try {
    const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    stmt.run([username, password]);
    stmt.free();
    return true;
  } catch (e) {
    console.error("Insert error:", e);
    return false;
  }
}

// SAFE user lookup
function getUser(username, password) {
  const stmt = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?");
  stmt.bind([username, password]);

  let rows = [];
  while (stmt.step()) rows.push(stmt.get());
  stmt.free();

  return rows;
}
