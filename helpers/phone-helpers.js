const countryCodes = {
    '60': 'Malaysia',
    '62': 'Indonesia',
    '65': 'Singapore',
    '66': 'Thailand',
    '63': 'Philippines',
    '84': 'Vietnam',
    '95': 'Myanmar',
    '855': 'Cambodia',
    '856': 'Laos',
    '673': 'Brunei',
    '1': 'United States',
    '44': 'United Kingdom',
    '61': 'Australia',
    '91': 'India'
};

function getCountryCode(phoneNumber) {
    const clean = phoneNumber.replace(/\D/g, '');
    for (const [code, country] of Object.entries(countryCodes)) {
        if (clean.startsWith(code)) {
            return country;
        }
    }
    return 'Unknown';
}

function validatePhoneNumber(phoneNumber) {
    const clean = phoneNumber.replace(/\D/g, '');
    if (clean.length < 7) {
        return { isValid: false, message: 'Nomor terlalu pendek' };
    }
    if (clean.length > 17) {
        return { isValid: false, message: 'Nomor terlalu panjang' };
    }
    return { 
        isValid: true, 
        cleanNumber: clean,
        country: getCountryCode(clean)
    };
}

module.exports = { getCountryCode, validatePhoneNumber }; 
