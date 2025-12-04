let db = null;
let SQL = null;

// Load sql.js and initialize DB
async function initDb() {
  SQL = await initSqlJs({
    locateFile: file => `https://sql.js.org/dist/${file}`
  });

  // Try loading saved DB from localStorage
  const saved = localStorage.getItem("mydb");

  if (saved) {
    console.log("Loading DB from localStorage...");
    const uIntArray = new Uint8Array(JSON.parse(saved));
    db = new SQL.Database(uIntArray);
  } else {
    console.log("Creating new in-memory DB...");
    db = new SQL.Database();
  }

  // Create table if it doesn't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      password TEXT
    );
  `);

  console.log("Users table ready");
}

// Save database to localStorage
function saveDb() {
  const data = db.export();
  const arr = Array.from(data);
  localStorage.setItem("mydb", JSON.stringify(arr));
  console.log("DB saved to localStorage");
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
    saveDb(); // auto-save after modifications
  } catch (e) {
    console.error("Exec error:", e);
  }
}

// Add a user safely
function addUser(username, password) {
  try {
    const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    stmt.run([username, password]);
    stmt.free();

    saveDb(); // save after insert
    return true;
  } catch (e) {
    console.error("Insert error:", e);
    return false;
  }
}

// Find a user
function getUser(username, password) {
  const stmt = db.prepare(
    "SELECT * FROM users WHERE username = ? AND password = ?"
  );
  stmt.bind([username, password]);

  let rows = [];
  while (stmt.step()) rows.push(stmt.get());
  stmt.free();

  return rows;
}
