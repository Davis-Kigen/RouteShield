const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { init, db } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', system: 'RouteShield Backend', timestamp: new Date().toISOString() });
});

// GET /api/routes: Return all routes with latest crowdsourced fare data
app.get('/api/routes', (req, res) => {
  try {
    const routes = db.prepare('SELECT * FROM routes').all();

    const enrichedRoutes = routes.map((route) => {
      const fareStats = db.prepare(`
        SELECT 
          AVG(reported_fare) as avg_fare,
          COUNT(*) as report_count,
          MAX(created_at) as last_report_time
        FROM fare_reports 
        WHERE route_id = ?
      `).get(route.id);

      const recentReports = db.prepare(`
        SELECT id, reported_fare, stage_name, created_at
        FROM fare_reports
        WHERE route_id = ?
        ORDER BY created_at DESC
        LIMIT 5
      `).all(route.id);

      return {
        ...route,
        crowdsourced: {
          avgFare: fareStats && fareStats.avg_fare ? Math.round(fareStats.avg_fare) : null,
          reportCount: fareStats ? fareStats.report_count || 0 : 0,
          lastReportTime: fareStats ? fareStats.last_report_time : null,
          recentReports: recentReports || []
        }
      };
    });

    res.json(enrichedRoutes);
  } catch (error) {
    console.error('Error fetching routes:', error);
    res.status(500).json({ error: 'Internal server error fetching routes' });
  }
});

// POST /api/fares/report: Log crowdsourced fare entries
app.post('/api/fares/report', (req, res) => {
  try {
    const { route_id, reported_fare, stage_name } = req.body;

    if (!route_id || !reported_fare) {
      return res.status(400).json({ error: 'route_id and reported_fare are required' });
    }

    const fareNumber = parseInt(reported_fare, 10);
    if (isNaN(fareNumber) || fareNumber <= 0) {
      return res.status(400).json({ error: 'reported_fare must be a positive integer' });
    }

    const route = db.prepare('SELECT id, route_name FROM routes WHERE id = ?').get(route_id);
    if (!route) {
      return res.status(404).json({ error: `Route ${route_id} not found` });
    }

    const info = db.prepare(`
      INSERT INTO fare_reports (route_id, reported_fare, stage_name)
      VALUES (?, ?, ?)
    `).run(route_id, fareNumber, stage_name || route.cbd_stage);

    console.log(`[FARE REPORT] Logged KES ${fareNumber} for ${route.route_name} (ID: ${info.lastInsertRowid})`);

    const stats = db.prepare(`
      SELECT AVG(reported_fare) as avg_fare, COUNT(*) as count 
      FROM fare_reports WHERE route_id = ?
    `).get(route_id);

    res.status(201).json({
      success: true,
      message: `Crowdsourced fare logged for ${route.route_name}`,
      reportId: info.lastInsertRowid,
      averageFare: Math.round(stats.avg_fare),
      totalReports: stats.count
    });
  } catch (error) {
    console.error('Error reporting fare:', error);
    res.status(500).json({ error: 'Internal server error reporting fare' });
  }
});

// POST /api/emergency/alert
app.post('/api/emergency/alert', (req, res) => {
  try {
    const { phone_number, route_id, latitude, longitude, details } = req.body;

    const info = db.prepare(`
      INSERT INTO emergency_alerts (phone_number, route_id, latitude, longitude, details)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      phone_number || 'COMMUTER_WEB_DISPATCH',
      route_id || 'UNKNOWN_STAGE',
      latitude || -1.2864,
      longitude || 36.8236,
      details || 'COMMUTER IN DISTRESS - SOS BUTTON PRESSED'
    );

    console.warn(`[EMERGENCY ALERT] SOS Alert ID ${info.lastInsertRowid} logged for route ${route_id}`);

    res.status(201).json({
      success: true,
      alertId: info.lastInsertRowid,
      message: 'Emergency distress beacon logged. Coordinates dispatched to local safety response.',
      safeZoneAdvisory: 'Move immediately to a designated Safe Zone with bright lighting and CCTV surveillance.'
    });
  } catch (error) {
    console.error('Error logging emergency alert:', error);
    res.status(500).json({ error: 'Internal server error logging emergency alert' });
  }
});

// POST /ussd: Africa's Talking USSD protocol (*384*123#)
app.post('/ussd', (req, res) => {
  try {
    const { phoneNumber, text } = req.body;
    let response = '';

    const input = (text || '').trim();
    const parts = input === '' ? [] : input.split('*');

    if (parts.length === 0) {
      response = `CON Welcome to RouteShield Nairobi\n1. Check Route & Fares\n2. Safe Stage Finder\n3. Report Emergency`;
    } else if (parts[0] === '1') {
      const routes = db.prepare('SELECT id, route_name, corridor FROM routes ORDER BY id ASC').all();

      if (parts.length === 1) {
        if (routes.length === 0) {
          response = `END No routes currently registered in RouteShield database.`;
        } else {
          const menuItems = routes
            .map((r, i) => `${i + 1}. ${r.route_name} (${r.corridor.split('(')[0].trim()})`)
            .join('\n');
          response = `CON Select Corridor:\n${menuItems}`;
        }
      } else if (parts.length === 2) {
        const selectedIndex = parseInt(parts[1], 10) - 1;
        if (!Number.isNaN(selectedIndex) && selectedIndex >= 0 && selectedIndex < routes.length) {
          const route = db.prepare('SELECT * FROM routes WHERE id = ?').get(routes[selectedIndex].id);
          if (route) {
            response = `END ${route.route_name}: ${route.corridor}\nStage: ${route.cbd_stage}\nOff-Peak: KES ${route.off_peak_min}-${route.off_peak_max}\nPeak Surge: KES ${route.peak_min}-${route.peak_max}\nSafe Zone: ${route.safe_zone}\nStatus: ${route.safety_status}`;
          } else {
            response = `END Route details unavailable at this time.`;
          }
        } else {
          response = `END Invalid route selected. Dial *384*123# to retry.`;
        }
      } else {
        response = `END Invalid input. Dial *384*123# to restart.`;
      }
    } else if (parts[0] === '2') {
      const safeStages = db.prepare('SELECT route_name, safe_zone FROM routes ORDER BY id ASC').all();
      if (safeStages.length === 0) {
        response = `END No safe havens recorded yet. Dial 999 for emergency.`;
      } else {
        const safeList = safeStages.map((r, i) => `${i + 1}. ${r.route_name}: ${r.safe_zone}`).join('\n');
        response = `END RouteShield 24/7 Lit Safe Zones:\n${safeList}\nEmergency: 999 / 112`;
      }
    } else if (parts[0] === '3') {
      const callerPhone = phoneNumber || 'ANONYMOUS_USSD';
      db.prepare(`INSERT INTO emergency_alerts (phone_number, route_id, details) VALUES (?, ?, ?)`)
        .run(callerPhone, 'USSD_CBD_DIRECT', 'USSD Option 3 Commuter SOS Dial');
      console.warn(`[USSD EMERGENCY] SOS logged from phone: ${callerPhone}`);
      response = `END EMERGENCY ALERT LOGGED!\nDistress signal flagged for ${callerPhone}.\nMove to nearest lit safe post immediately.\nNational Police: 999 or 112\nNairobi County Emergency: 020 2222181`;
    } else {
      response = `END Invalid selection. Please dial *384*123# to restart.`;
    }

    res.set('Content-Type', 'text/plain');
    res.send(response);
  } catch (error) {
    console.error('Error handling USSD request:', error);
    res.set('Content-Type', 'text/plain');
    res.send('END System temporarily unavailable. Please call 999 for emergencies.');
  }
});

// ---------------------------------------------------------------------------
// Start — wait for DB to initialise before accepting requests
// ---------------------------------------------------------------------------
init().then(() => {
  app.listen(PORT, () => {
    console.log(`RouteShield Backend running on http://localhost:${PORT}`);
    console.log(`- Routes API:    http://localhost:${PORT}/api/routes`);
    console.log(`- USSD Endpoint: http://localhost:${PORT}/ussd (*384*123#)`);
  });
}).catch((err) => {
  console.error('Failed to initialise database:', err);
  process.exit(1);
});
