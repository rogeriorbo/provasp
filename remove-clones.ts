import fs from 'fs';

let content = fs.readFileSync('src/data/questions.ts', 'utf-8');

// The file exports Interfaces and objects.
// Wait, actually writing a regex to deduplicate JSON-like arrays might be easier, because we don't want to lose the formatting.

const arrRegex = /questions:\s*\[([\s\S]*?)\]/g;

let newContent = content.replace(arrRegex, (match, p1) => {
    const questions = [];
    const lines = p1.split(/,\s*\n/); // assuming comma-separated objects
    const seen = new Set();
    const uniqueLines = [];
    
    for (let line of lines) {
        // try to match question property to see if we've seen it
        const qMatch = line.match(/"question":\s*"([^"]*)"/);
        if (qMatch) {
            if (!seen.has(qMatch[1])) {
                seen.add(qMatch[1]);
                uniqueLines.push(line);
            }
        } else {
             uniqueLines.push(line);
        }
    }
    return 'questions: [\n' + uniqueLines.join(',\n') + '\n]';
});

// Since parsing string lines might be risky with commas missing or extra, let's just make sure we only remove exact duplicate lines of JSON strings?
// Let's use it as a first attempt. Or we can just use `npx eslint --fix` after a real TS rewrite.
