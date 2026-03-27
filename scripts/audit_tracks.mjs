import http from 'http';
import https from 'https';

// Need to dynamically import constants because it's a TS file.
// For a quick Node script, we can read constants.ts with fs and extract URLs.
import fs from 'fs';

const constantsPath = '../constants.ts';
const content = fs.readFileSync(new URL(constantsPath, import.meta.url), 'utf-8');

// Use a regex to find all media.githubusercontent.com links
const urlRegex = /https:\/\/media\.githubusercontent\.com\/media\/BesouroLAB\/albumsankofa\/main\/ensaio-show\/[^'"]+/g;
const matches = content.match(urlRegex) || [];

console.log(`Found ${matches.length} tracks to audit...`);

async function checkUrl(url) {
    return new Promise((resolve) => {
        // We use GET because HEAD on GitHub media might behave differently or redirect weirdly.
        // But to avoid downloading, we can abort the request after receiving headers.
        const req = https.get(url, (res) => {
            const status = res.statusCode;
            // Clean up the request right away since we just need the status
            res.destroy(); 
            
            if (status >= 200 && status < 400) { // Accounting for 3xx redirects
                resolve({ url, status, ok: true });
            } else {
                resolve({ url, status, ok: false });
            }
        }).on('error', (err) => {
            resolve({ url, status: 'ERROR', ok: false, error: err.message });
        });
        
        // Timeout
        req.setTimeout(5000, () => {
            req.destroy();
            resolve({ url, status: 'TIMEOUT', ok: false });
        });
    });
}

// Check in batches to not overwhelm the network
async function runAudit() {
    const brokenLinks = [];
    const batchSize = 10;
    
    for (let i = 0; i < matches.length; i += batchSize) {
        const batch = matches.slice(i, i + batchSize);
        console.log(`Checking batch ${Math.floor(i / batchSize) + 1}...`);
        
        const results = await Promise.all(batch.map(checkUrl));
        
        results.forEach(res => {
            if (!res.ok) {
                console.error(`❌ BROKEN: [${res.status}] ${res.url}`);
                brokenLinks.push(res);
            }
        });
    }
    
    console.log('\n--- AUDIT COMPLETE ---');
    if (brokenLinks.length === 0) {
        console.log('✅ All audio tracks are accessible (HTTP 200/3xx).');
    } else {
        console.log(`❌ Found ${brokenLinks.length} broken links:`);
        brokenLinks.forEach(b => console.log(`   - ${b.url}`));
    }
}

runAudit();
