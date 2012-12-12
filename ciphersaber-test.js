var source = 'ba 9a b4 cf fb 77 00 e6 18 e3 82 e8 fc c5 ab 98 13 b1 ab c4 36 ba 7d 5c de a1 a3 1f b7 2f b5 76 3c 44 cf c2 ac 77 af ee 19 ad';
var key = 'asdfg';
var rounds = 10;

var sourceBytes = hexToBytes(source);
var keyBytes = stringToBytes(key);

// decrypt test
var outString = bytesToString(decrypt(sourceBytes, keyBytes, rounds));
  
console.log(outString);

// round trip test
console.log(bytesToString(decrypt(encrypt(stringToBytes(outString), keyBytes, 500000), keyBytes, 500000)));