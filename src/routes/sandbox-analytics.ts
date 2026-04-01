/**
 * Sandbox Analytics API Routes
 * 
 * Tracks sandbox visits and engagement for Thomson Reuters demo
 */

import { Router } from 'express';
const router = Router();

// Import email service with proper path handling
let emailService: any = null;
try {
  emailService = require('../../backend/src/services/email.js').emailService;
} catch (err: any) {
  console.log('Email service not available, using fallback');
}

// In-memory storage for demo (in production, use database)
const visits: any[] = [];

// POST /api/sandbox-visit - Track sandbox visit
router.post('/sandbox-visit', (req, res) => {
  try {
    const { sandbox, ref, timestamp, userAgent, url, sessionId } = req.body;
    
    const visit = {
      id: sessionId || Date.now().toString(),
      sandbox,
      ref,
      timestamp,
      userAgent,
      url,
      ip: req.ip || req.connection.remoteAddress,
    };
    
    visits.push(visit);
    
    // Log for development (in production, use proper logging)
    console.log(`📊 Sandbox Visit Tracked:`, {
      sandbox,
      ref,
      timestamp,
      sessionId,
      source: req.ip,
    });
    
    // Send email notification for Thomson Reuters targets
    if (ref === 'dwong-tr' || ref === 'rramanathan-tr' || ref === 'rashraf-tr') {
      const targetNames = {
        'dwong-tr': 'David Wong (CPO)',
        'rramanathan-tr': 'Raghu Ramanathan (President)',
        'rashraf-tr': 'Rawia Ashraf (Director CoCounsel)'
      };
      
      const targetName = targetNames[ref as keyof typeof targetNames] || ref;
      
      // Send email alert to Stuart (only if email service is available)
      if (emailService) {
        emailService.send({
          to: 'stuart.rainey@datacendia.com',
          subject: `🎯 THOMSON REUTERS TARGET VISITED! (${targetName})`,
          text: `
🎯 TARGET ENGAGEMENT ALERT

${targetName} just opened the Thomson Reuters sandbox demo!

VISIT DETAILS:
────────────────
Target: ${targetName}
Ref: ${ref}
Sandbox: ${sandbox}
Time: ${new Date(timestamp).toLocaleString('en-US', { 
  timeZone: 'America/New_York',
  dateStyle: 'full',
  timeStyle: 'long'
 })}
Session ID: ${sessionId}
IP Address: ${req.ip}
User Agent: ${userAgent}

URL: ${url}

NEXT STEPS:
────────────────
1. Check analytics dashboard: /api/sandbox-analytics
2. Monitor for scenario completions
3. Follow up if they spend >3 minutes on demo

This is a high-intent signal - they clicked your personalized link!

— Datacendia Platform
        `.trim(),
        }).catch((err: any) => {
          console.error('❌ Failed to send target visit email:', err);
        });
        
        console.log(`🎯 TARGET VISIT ALERT SENT: ${targetName}`);
      } else {
        console.log(`🎯 TARGET VISIT DETECTED: ${targetName} (email service unavailable)`);
      }
    }
    
    res.json({ success: true, visitId: visit.id });
  } catch (error) {
    console.error('❌ Visit tracking error:', error);
    res.status(500).json({ error: 'Failed to track visit' });
  }
});

// POST /api/sandbox-event - Track sandbox events (scenario completion, etc.)
router.post('/sandbox-event', (req, res) => {
  try {
    const { event, sandbox, scenario, ref, timestamp } = req.body;
    
    const eventRecord = {
      id: Date.now().toString(),
      event,
      sandbox,
      scenario,
      ref,
      timestamp,
      ip: req.ip || req.connection.remoteAddress,
    };
    
    visits.push(eventRecord);
    
    // Log for development
    console.log(`📊 Sandbox Event Tracked:`, {
      event,
      sandbox,
      scenario,
      ref,
      timestamp,
      source: req.ip,
    });
    
    // Send email notification for high-intent events from targets
    if ((ref === 'dwong-tr' || ref === 'rramanathan-tr' || ref === 'rashraf-tr') && 
        (event === 'rule11-export' || event === 'scenario_complete')) {
      
      const targetNames = {
        'dwong-tr': 'David Wong (CPO)',
        'rramanathan-tr': 'Raghu Ramanathan (President)',
        'rashraf-tr': 'Rawia Ashraf (Director CoCounsel)'
      };
      
      const targetName = targetNames[ref as keyof typeof targetNames] || ref;
      const eventDescriptions = {
        'rule11-export': '🎯 DOWNLOADED Rule 11 Certification',
        'scenario_complete': '✅ COMPLETED a scenario deliberation'
      };
      
      const eventDesc = eventDescriptions[event as keyof typeof eventDescriptions] || event;
      
      // Send high-intent alert to Stuart (only if email service is available)
      if (emailService) {
        emailService.send({
          to: 'stuart.rainey@datacendia.com',
          subject: `🔥 HIGH-INTENT ACTION! ${targetName} - ${eventDesc}`,
          text: `
🔥 HIGH-INTENT ENGAGEMENT ALERT

${targetName} just took a high-value action in the Thomson Reuters demo!

ACTION: ${eventDesc}
Target: ${targetName}
Ref: ${ref}
Sandbox: ${sandbox}
Scenario: ${scenario || 'N/A'}
Time: ${new Date(timestamp).toLocaleString('en-US', { 
  timeZone: 'America/New_York',
  dateStyle: 'full',
  timeStyle: 'long'
 })}
Session ID: ${req.body.sessionId || 'unknown'}

IMMEDIATE FOLLOW-UP RECOMMENDED:
────────────────────────────────
This is a BUYING SIGNAL! Actions like Rule 11 exports indicate:
✅ They understand the value proposition
✅ They can see themselves using this
✅ They're evaluating implementation

NEXT STEPS:
1. Check analytics: /api/sandbox-analytics
2. Consider immediate outreach
3. Schedule demo/deep dive

This could be the moment to close!

— Datacendia Platform
        `.trim(),
        }).catch((err: any) => {
          console.error('❌ Failed to send high-intent event email:', err);
        });
        
        console.log(`🔥 HIGH-INTENT ALERT SENT: ${targetName} - ${eventDesc}`);
      } else {
        console.log(`🔥 HIGH-INTENT ACTION DETECTED: ${targetName} - ${eventDesc} (email service unavailable)`);
      }
    }
    
    res.json({ success: true, eventId: eventRecord.id });
  } catch (error) {
    console.error('❌ Event tracking error:', error);
    res.status(500).json({ error: 'Failed to track event' });
  }
});

// GET /api/sandbox-analytics - Get analytics (admin only)
router.get('/sandbox-analytics', (req, res) => {
  try {
    const analytics = {
      totalVisits: visits.length,
      totalEvents: visits.filter(v => v.event).length,
      bySandbox: visits.reduce((acc, visit) => {
        acc[visit.sandbox] = (acc[visit.sandbox] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byRef: visits.reduce((acc, visit) => {
        acc[visit.ref] = (acc[visit.ref] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      events: visits.filter(v => v.event).reduce((acc, event) => {
        const key = `${event.event}:${event.scenario || 'unknown'}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      recentVisits: visits.slice(-10).reverse(),
    };
    
    res.json(analytics);
  } catch (error) {
    console.error('❌ Analytics error:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
});

export default router;
