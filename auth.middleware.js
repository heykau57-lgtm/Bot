const { activeSessions, savePersistentSessions } = require('./session-store.js');
const { getUsers } = require('./user-manager.js');

function requireAuth(req, res, next) {
    const username = req.cookies.sessionUser;
    const clientSessionId = req.cookies.sessionId;
    
    if (!username || !clientSessionId) {
        return res.redirect("/login?msg=Silakan login terlebih dahulu");
    }
    
    const activeSession = activeSessions.get(username);
    
    if (!activeSession || activeSession.sessionId !== clientSessionId) {
        activeSessions.delete(username);
        savePersistentSessions();
        
        res.clearCookie("sessionUser", { path: "/", expires: new Date(0) });
        res.clearCookie("sessionId", { path: "/", expires: new Date(0) });
        
        return res.redirect("/login?msg=Session tidak valid");
    }
    
    if (Date.now() > activeSession.expiresAt) {
        activeSessions.delete(username);
        savePersistentSessions();
        
        res.clearCookie("sessionUser", { path: "/", expires: new Date(0) });
        res.clearCookie("sessionId", { path: "/", expires: new Date(0) });
        
        return res.redirect("/login?msg=Session expired, login ulang");
    }
    
    const users = getUsers();
    const currentUser = users.find(u => u.username === username);
    
    if (!currentUser) {
        activeSessions.delete(username);
        savePersistentSessions();
        
        res.clearCookie("sessionUser", { path: "/", expires: new Date(0) });
        res.clearCookie("sessionId", { path: "/", expires: new Date(0) });
        
        return res.redirect("/login?msg=User tidak ditemukan");
    }
    
    if (Date.now() > currentUser.expired) {
        activeSessions.delete(username);
        savePersistentSessions();
        
        res.clearCookie("sessionUser", { path: "/", expires: new Date(0) });
        res.clearCookie("sessionId", { path: "/", expires: new Date(0) });
        
        return res.redirect("/login?msg=Akun expired, hubungi admin");
    }
    
    if (activeSession.remember) {
        activeSession.expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000);
        activeSessions.set(username, activeSession);
        savePersistentSessions();
    }
    
    next();
}

module.exports = { requireAuth };
