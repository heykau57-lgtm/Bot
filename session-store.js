const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SESSIONS_FILE = path.join(__dirname, 'database', 'active_sessions.json');
let activeSessions = new Map();

function loadPersistentSessions() {
    try {
        if (fs.existsSync(SESSIONS_FILE)) {
            const data = fs.readFileSync(SESSIONS_FILE, 'utf8');
            const sessions = JSON.parse(data);
            Object.entries(sessions).forEach(([key, value]) => {
                if (Date.now() < value.expiresAt) {
                    activeSessions.set(key, value);
                }
            });
            console.log(`[SESSION] Loaded ${activeSessions.size} persistent sessions`);
        }
    } catch (err) {
        console.error('[SESSION] Failed to load sessions:', err);
    }
}

function savePersistentSessions() {
    try {
        const sessions = {};
        activeSessions.forEach((value, key) => {
            if (Date.now() < value.expiresAt) {
                sessions[key] = value;
            }
        });
        fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
    } catch (err) {
        console.error('[SESSION] Failed to save sessions:', err);
    }
}

function cleanupExpiredSessions() {
    let cleaned = 0;
    activeSessions.forEach((session, key) => {
        if (Date.now() > session.expiresAt) {
            activeSessions.delete(key);
            cleaned++;
        }
    });
    if (cleaned > 0) {
        savePersistentSessions();
        console.log(`[SESSION] Cleaned up ${cleaned} expired sessions`);
    }
}

function generateSessionId() {
    return crypto.randomBytes(32).toString('hex');
}

loadPersistentSessions();
setInterval(cleanupExpiredSessions, 60 * 60 * 1000);

module.exports = {
    activeSessions,
    savePersistentSessions,
    cleanupExpiredSessions,
    generateSessionId
};
