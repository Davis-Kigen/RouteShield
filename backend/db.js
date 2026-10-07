const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'routeshield.db');

// ---------------------------------------------------------------------------
// Build a synchronous wrapper around sql.js that mimics the better-sqlite3
// interface used throughout server.js (prepare / .run / .get / .all / exec).
// ---------------------------------------------------------------------------

let _db = null;

function getDB() {
  return _db;
}

// Persist db to disk after every mutating statement
function persist() {
  const data = _db.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
}

// Thin wrapper returned by prepare()
function makeStatement(sql) {
  return {
    run(...args) {
      // sql.js run() does not return lastInsertRowid — fetch it separately
      _db.run(sql, flattenArgs(args));
      const [[lastId]] = _db.exec('SELECT last_insert_rowid()')[0]?.values || [[0]];
      persist();
      return { lastInsertRowid: lastId, changes: 1 };
    },
    get(...args) {
      const stmt = _db.prepare(sql);
      stmt.bind(flattenArgs(args));
      if (stmt.step()) {
        const row = stmt.getAsObject();
        stmt.free();
        return row;
      }
      stmt.free();
      return undefined;
    },
    all(...args) {
      const stmt = _db.prepare(sql);
      stmt.bind(flattenArgs(args));
      const rows = [];
      while (stmt.step()) rows.push(stmt.getAsObject());
      stmt.free();
      return rows;
    }
  };
}

function flattenArgs(args) {
  // Accept either prepare('...').run(a,b,c) or prepare('...').run([a,b,c])
  if (args.length === 1 && Array.isArray(args[0])) return args[0];
  return args;
}

// Public db facade
const db = {
  prepare: (sql) => makeStatement(sql),
  exec: (sql) => {
    _db.run(sql);
    persist();
  },
  pragma: () => {}, // no-op (sql.js doesn't expose pragma the same way)
  transaction: (fn) => {
    // Simple synchronous transaction wrapper
    return (arg) => {
      _db.run('BEGIN');
      try {
        fn(arg);
        _db.run('COMMIT');
        persist();
      } catch (e) {
        _db.run('ROLLBACK');
        throw e;
      }
    };
  }
};

// ---------------------------------------------------------------------------
// Bootstrap: load existing db from disk or create a fresh one
// ---------------------------------------------------------------------------

async function init() {
  const SQL = await initSqlJs();

  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    _db = new SQL.Database(fileBuffer);
    console.log('Loaded existing RouteShield database from disk.');
  } else {
    _db = new SQL.Database();
    console.log('Created new in-memory RouteShield database.');
  }

  // Create tables
  _db.run(`
    CREATE TABLE IF NOT EXISTS routes (
      id TEXT PRIMARY KEY,
      route_name TEXT NOT NULL,
      corridor TEXT NOT NULL,
      cbd_stage TEXT NOT NULL,
      safe_zone TEXT NOT NULL,
      off_peak_min INTEGER NOT NULL,
      off_peak_max INTEGER NOT NULL,
      peak_min INTEGER NOT NULL,
      peak_max INTEGER NOT NULL,
      safety_status TEXT NOT NULL,
      advisory TEXT NOT NULL,
      cbd_lat REAL DEFAULT -1.2864,
      cbd_lng REAL DEFAULT 36.8236,
      safe_zone_lat REAL DEFAULT -1.2880,
      safe_zone_lng REAL DEFAULT 36.8230
    );
  `);

  _db.run(`
    CREATE TABLE IF NOT EXISTS fare_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      route_id TEXT NOT NULL,
      reported_fare INTEGER NOT NULL,
      stage_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  _db.run(`
    CREATE TABLE IF NOT EXISTS emergency_alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone_number TEXT NOT NULL,
      route_id TEXT,
      latitude REAL,
      longitude REAL,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed initial routes if empty
  const stmt = _db.prepare('SELECT COUNT(*) as count FROM routes');
  stmt.step();
  const { count } = stmt.getAsObject();
  stmt.free();

  if (Number(count) === 0) {
    const insert = _db.prepare(`
      INSERT INTO routes (
        id, route_name, corridor, cbd_stage, safe_zone,
        off_peak_min, off_peak_max, peak_min, peak_max,
        safety_status, advisory, cbd_lat, cbd_lng, safe_zone_lat, safe_zone_lng
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const initialRoutes = [
      ['125', 'Route 125', "CBD to Ongata Rongai (via Lang'ata Road)", 'Railways Bus Station / Haile Selassie Roundabout', 'Co-op Bank House / Green Park Walkway Police Post (24/7 Lit)', 70, 100, 120, 200, 'Secure Patrols Active', 'Board exclusively inside Railways terminal bays after dusk. Security patrols operate along Haile Selassie until 11:30 PM.', -1.2917, 36.8258, -1.2905, 36.8242],
      ['45',  'Route 45',  'CBD to Githurai 45 (via Thika Superhighway)',        'Tuskys Ronald Ngala / Odeon Cinema Stage',                    'Central Police Station Walkway & Odeon Lighted Bay',          50, 80,  100, 160, 'High Vigilance Required', 'High foot-traffic rush hour surge between 6:00 PM and 8:30 PM. Keep personal belongings zipped; queue in designated floodlit lane.', -1.2842, 36.8273, -1.2835, 36.8265],
      ['105', 'Route 105', 'CBD to Kikuyu / Westlands (via Waiyaki Way)',        'Kencom / Ambassadeur / Khoja Roundabout Stage',               'City Hall Annex / Supreme Court 24/7 Guard Post',             60, 90,  100, 170, 'Safe & Monitored',       'Continuously active CCTV coverage. Evening queues are orderly; verify conductor matatu Sacco badge before boarding.',              -1.2855, 36.8236, -1.2868, 36.8228],
    ];

    _db.run('BEGIN');
    for (const row of initialRoutes) {
      insert.bind(row);
      insert.step();
      insert.reset();
    }
    _db.run('COMMIT');
    insert.free();

    persist();
    console.log('Pre-populated SQLite database with 3 core Nairobi corridors.');
  }

  return db;
}

module.exports = { init, db };
