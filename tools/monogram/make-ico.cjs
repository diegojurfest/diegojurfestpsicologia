// Empaqueta favicon-32.png dentro de un favicon.ico (ICO admite PNG embebido).
const fs = require('fs');
const path = require('path');
const PUB = path.resolve(__dirname, '../../public');
const png = fs.readFileSync(path.join(PUB, 'favicon-32.png'));
const SIZE = 32;

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);   // reserved
header.writeUInt16LE(1, 2);   // type 1 = icon
header.writeUInt16LE(1, 4);   // image count

const entry = Buffer.alloc(16);
entry.writeUInt8(SIZE, 0);            // width
entry.writeUInt8(SIZE, 1);            // height
entry.writeUInt8(0, 2);               // palette
entry.writeUInt8(0, 3);               // reserved
entry.writeUInt16LE(1, 4);            // color planes
entry.writeUInt16LE(32, 6);           // bits per pixel
entry.writeUInt32LE(png.length, 8);   // size of image data
entry.writeUInt32LE(6 + 16, 12);      // offset to image data

fs.writeFileSync(path.join(PUB, 'favicon.ico'), Buffer.concat([header, entry, png]));
console.log('favicon.ico written (' + png.length + ' bytes embedded)');
