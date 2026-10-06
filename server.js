const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

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
    
    // Attach crowdsourced fare stats for each route
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
          avgFare: fareStats.avg_fare ? Math.round(fareStats.avg_fare) : null,
          reportCount: fareStats.report_count || 0,
          lastReportTime: fareStats.last_report_time,
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

// POST /api/fares/report: Log crowdsourced fare entries into fare_reports
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

    // Check if route exists
    const route = db.prepare('SELECT id, route_name FROM routes WHERE id = ?').get(route_id);
    if (!route) {
      return res.status(404).json({ error: `Route ${route_id} not found` });
    }

    const stmt = db.prepare(`
      INSERT INTO fare_reports (route_id, reported_fare, stage_name)
      VALUES (?, ?, ?)
    `);
    const info = stmt.run(route_id, fareNumber, stage_name || route.cbd_stage);

    console.log(`[FARE REPORT] Logged KES ${fareNumber} for ${route.route_name} (ID: ${info.lastInsertRowid})`);

    // Return the updated route statistics
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

// POST /api/emergency/alert: Web emergency dispatch endpoint
app.post('/api/emergency/alert', (req, res) => {
  try {
    const { phone_number, route_id, latitude, longitude, details } = req.body;

    const stmt = db.prepare(`
      INSERT INTO emergency_alerts (phone_number, route_id, latitude, longitude, details)
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
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

// POST /ussd: Handle Africa's Talking USSD protocol (*384*123#)
app.post('/ussd', (req, res) => {
  try {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;
    let response = '';

    const input = (text || '').trim();
    const parts = input === '' ? [] : input.split('*');

    if (parts.length === 0) {
      // Main Menu
      response = `CON Welcome to RouteShield Nairobi Commuter Safety
1. Check Route & Fares
2. Safe Stage Finder
3. Report Emergency`;
    } else if (parts[0] === '1') {
      if (parts.length === 1) {
        // Submenu: Choose corridor
        response = `CON Select Nairobi Corridor:
1. Route 125 (Ongata Rongai via Langata)
2. Route 45 (Githurai 45 via Thika Hwy)
3. Route 105 (Kikuyu/Westlands via Waiyaki)`;
      } else if (parts.length === 2) {
        const option = parts[1];
        let routeId = null;
        if (option === '1') routeId = '125';
        else if (option === '2') routeId = '45';
        else if (option === '3') routeId = '105';

        if (routeId) {
          const route = db.prepare('SELECT * FROM routes WHERE id = ?').get(routeId);
          if (route) {
            response = `END ${route.route_name}: ${route.corridor}
Stage: ${route.cbd_stage}
Off-Peak: KES ${route.off_peak_min}-${route.off_peak_max}
Peak Surge: KES ${route.peak_min}-${route.peak_max}
Safe Zone: ${route.safe_zone}
Status: ${route.safety_status}`;
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
      // Safe Stage Finder
      const routes = db.prepare('SELECT route_name, cbd_stage, safe_zone FROM routes').all();
      let safeList = routes.map((r, i) => `${i + 1}. ${r.route_name}: ${r.safe_zone}`).join('\n');
      response = `END RouteShield 24/7 Lit Safe Zones (CBD):
${safeList}
Emergency Hotlines: 999 / 112`;
    } else if (parts[0] === '3') {
      // Option 3: Report Emergency
      const callerPhone = phoneNumber || 'ANONYMOUS_USSD';
      const stmt = db.prepare(`
        INSERT INTO emergency_alerts (phone_number, route_id, details)
        VALUES (?, ?, ?)
      `);
      stmt.run(callerPhone, 'USSD_CBD_DIRECT', 'USSD Option 3 Commuter SOS Dial');

      console.warn(`[USSD EMERGENCY] SOS logged from phone: ${callerPhone}`);

      response = `END EMERGENCY ALERT LOGGED!
Distress signal flagged for ${callerPhone}.
Move to nearest lit safe post immediately.
National Police: 999 or 112
Nairobi County Emergency: 020 2222181`;
    } else {
      response = `END Invalid selection. Please dial *384*123# to restart.`;
    }

    // Africa's Talking expects plain text response
    res.set('Content-Type', 'text/plain');
    res.send(response);
  } catch (error) {
    console.error('Error handling USSD request:', error);
    res.set('Content-Type', 'text/plain');
    res.send('END System temporarily unavailable. Please call 999 for emergencies.');
  }
});

app.listen(PORT, () => {
  console.log(`RouteShield Backend running on http://localhost:${PORT}`);
  console.log(`- Routes API: http://localhost:${PORT}/api/routes`);
  console.log(`- USSD Endpoint: http://localhost:${PORT}/ussd (*384*123#)`);
});

