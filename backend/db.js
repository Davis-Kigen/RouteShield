const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'routeshield.db');
const db = new Database(dbPath);

// Enable foreign keys and WAL mode for better concurrency and durability
db.pragma('journal_mode = WAL');

// Initialize tables
db.exec(`
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

  CREATE TABLE IF NOT EXISTS fare_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    route_id TEXT NOT NULL,
    reported_fare INTEGER NOT NULL,
    stage_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (route_id) REFERENCES routes (id)
  );

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

// Pre-populate core Nairobi corridors if empty
const countRoutes = db.prepare('SELECT COUNT(*) as count FROM routes').get();
if (countRoutes.count === 0) {
  const insertRoute = db.prepare(`
    INSERT INTO routes (
      id, route_name, corridor, cbd_stage, safe_zone,
      off_peak_min, off_peak_max, peak_min, peak_max,
      safety_status, advisory, cbd_lat, cbd_lng, safe_zone_lat, safe_zone_lng
    ) VALUES (
      @id, @route_name, @corridor, @cbd_stage, @safe_zone,
      @off_peak_min, @off_peak_max, @peak_min, @peak_max,
      @safety_status, @advisory, @cbd_lat, @cbd_lng, @safe_zone_lat, @safe_zone_lng
    )
  `);

  const initialRoutes = [
    {
      id: '125',
      route_name: 'Route 125',
      corridor: "CBD to Ongata Rongai (via Lang'ata Road)",
      cbd_stage: 'Railways Bus Station / Haile Selassie Roundabout',
      safe_zone: 'Co-op Bank House / Green Park Walkway Police Post (24/7 Lit)',
      off_peak_min: 70,
      off_peak_max: 100,
      peak_min: 120,
      peak_max: 200,
      safety_status: 'Secure Patrols Active',
      advisory: 'Board exclusively inside Railways terminal bays after dusk. Security patrols operate along Haile Selassie until 11:30 PM.',
      cbd_lat: -1.2917,
      cbd_lng: 36.8258,
      safe_zone_lat: -1.2905,
      safe_zone_lng: 36.8242
    },
    {
      id: '45',
      route_name: 'Route 45',
      corridor: 'CBD to Githurai 45 (via Thika Superhighway)',
      cbd_stage: 'Tuskys Ronald Ngala / Odeon Cinema Stage',
      safe_zone: 'Central Police Station Walkway & Odeon Lighted Bay',
      off_peak_min: 50,
      off_peak_max: 80,
      peak_min: 100,
      peak_max: 160,
      safety_status: 'High Vigilance Required',
      advisory: 'High foot-traffic rush hour surge between 6:00 PM and 8:30 PM. Keep personal belongings zipped; queue in designated floodlit lane.',
      cbd_lat: -1.2842,
      cbd_lng: 36.8273,
      safe_zone_lat: -1.2835,
      safe_zone_lng: 36.8265
    },
    {
      id: '105',
      route_name: 'Route 105',
      corridor: 'CBD to Kikuyu / Westlands (via Waiyaki Way)',
      cbd_stage: 'Kencom / Ambassadeur / Khoja Roundabout Stage',
      safe_zone: 'City Hall Annex / Supreme Court 24/7 Guard Post',
      off_peak_min: 60,
      off_peak_max: 90,
      peak_min: 100,
      peak_max: 170,
      safety_status: 'Safe & Monitored',
      advisory: 'Continuously active CCTV coverage. Evening queues are orderly; verify conductor matatu Sacco badge before boarding.',
      cbd_lat: -1.2855,
      cbd_lng: 36.8236,
      safe_zone_lat: -1.2868,
      safe_zone_lng: 36.8228
    }
  ];

  const insertMany = db.transaction((routes) => {
    for (const r of routes) insertRoute.run(r);
  });

  insertMany(initialRoutes);
  console.log('Pre-populated SQLite database with 3 core Nairobi corridors.');
}

module.exports = db;

