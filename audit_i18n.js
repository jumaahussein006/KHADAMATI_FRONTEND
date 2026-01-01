const fs = require('fs');
const path = require('path');

const srcDir = './src';
const localesDir = './src/i18n/locales';

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + '/' + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
        } else {
            if (file.endsWith('.jsx') || file.endsWith('.js')) {
                arrayOfFiles.push(path.join(dirPath, '/', file));
            }
        }
    });

    return arrayOfFiles;
}

const allFiles = getAllFiles(srcDir);
const keysInCode = new Set();
const tRegex = /t\(['"]([^'"]+)['"]/g;

allFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    let match;
    while ((match = tRegex.exec(content)) !== null) {
        keysInCode.add(match[1]);
    }
});

const enJson = JSON.parse(fs.readFileSync(path.join(localesDir, 'en.json'), 'utf8').replace(/^\uFEFF/, ''));

function getKeysFromJson(json, prefix = '') {
    let keys = [];
    for (const key in json) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof json[key] === 'object' && !Array.isArray(json[key])) {
            keys = keys.concat(getKeysFromJson(json[key], fullKey));
        } else {
            keys.push(fullKey);
        }
    }
    return keys;
}

const keysInJson = new Set(getKeysFromJson(enJson));

const missingKeys = [];
keysInCode.forEach(key => {
    if (!keysInJson.has(key)) {
        missingKeys.push(key);
    }
});

console.log('Total keys in code:', keysInCode.size);
console.log('Total keys in en.json:', keysInJson.size);
console.log('Missing keys in en.json:', JSON.stringify(missingKeys.sort(), null, 2));
