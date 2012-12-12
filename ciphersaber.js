// Helpers
function hexToBytes(hex) {
    return hex.split(' ').map(function(h) {
        return parseInt(h, 16);
    });
}

function bytesToHex(b) {
    var s = '';
    for (var i = 0; i < b.length; i++) {
        var hex = b[i].toString(16);
        if (hex.length < 2) hex = '0' + hex;
        s += hex + ' ';
    }
    return s.trim();
}

function stringToBytes(s) {
    var b = [];
    for (var i = 0; i < s.length; i++) {
        b.push(s.charCodeAt(i));
    }
    return b;
}

function bytesToString(b) {
    var s = '';
    for (var i = 0; i < b.length; i++) {
        s += String.fromCharCode(b[i]);
    }
    return s;
}

function swap(array, i, j) {
    var temp = array[j];
    array[j] = array[i];
    array[i] = temp;
}

// Encrypt and decrypt

function encrypt(sourceBytes, keyBytes, mixingRounds) {
    // First 10 bytes of encrypted data is the IV
    keyBytes = keyBytes.slice(0);
    for (var i = 0; i < 10; i++) {
        var val = Math.floor(Math.random() * 256);
        keyBytes.push(val);
    }
    var encrypted = cipher(sourceBytes, keyBytes, mixingRounds);
    var output = [];
    for (var i = keyBytes.length - 10; i < keyBytes.length; i++) {
        output.push(keyBytes[i]);
    }
    for (var i = 0; i < encrypted.length; i++) {
        output.push(encrypted[i]);
    }
    return output;
}

function decrypt(sourceBytes, keyBytes, mixingRounds) {
    // First 10 bytes of encrypted data is the IV
    for (var i = 0; i < 10; i++) {
        keyBytes.push(sourceBytes[i]);
    }
    sourceBytes = sourceBytes.slice(10);
    return cipher(sourceBytes, keyBytes, mixingRounds);
}

// Base cipher function

function cipher(sourceBytes, keyBytes, mixingRounds) {
    mixingRounds = mixingRounds || 1;
    
    // Initialize state
    var state = [];
    for (var i = 0; i < 256; i++) {
        state.push(i);
    }
    
    // Key setup
    var j = 0;
    for (var round = 0; round < mixingRounds; round++) {
        for (var i = 0; i < 256; i++) {
             j = (j + state[i] + keyBytes[i % keyBytes.length]) % 256;
             swap(state, i, j);
        }
    }
    
    // Ciphering
    i = 0;
    j = 0;
    var outBytes = [];
    for (var k = 0; k < sourceBytes.length; k++) {
        i = (i + 1) % 256;
        j = (j + state[i]) % 256;
        swap(state, i, j);
        var n = (state[i] + state[j]) % 256;
        var out = state[n] ^ sourceBytes[k];
        outBytes.push(out);
    }
    
    return outBytes;
}
