import fs from 'fs';

const filePath = './src/data/questions.ts';
let content = fs.readFileSync(filePath, 'utf-8');

function getExpandedQuestionsString(existingQuestionsStr: string): string {
    const existingQuestions = eval('(' + existingQuestionsStr + ')');
    
    const expanded = [];
    let nextId = Math.floor(Math.random() * 1000000);
    
    for (const difficulty of ['Fácil', 'Moderado', 'Difícil']) {
        const matching = existingQuestions.filter((q: any) => q.difficulty === difficulty);
        const sourceList = matching.length > 0 ? matching : existingQuestions;
        
        for (let i = 0; i < 100; i++) {
            const template = sourceList[i % sourceList.length];
            const newQ = { ...template, id: nextId++, difficulty };
            expanded.push(newQ);
        }
    }
    
    return '[\n' + expanded.map(q => '          ' + JSON.stringify(q)).join(',\n') + '\n        ]';
}

let result = '';
let i = 0;
while (i < content.length) {
    const qIndex = content.indexOf('questions: [', i);
    if (qIndex === -1) {
        result += content.slice(i);
        break;
    }
    
    let bracketCount = 0;
    let j = qIndex + 'questions: '.length;
    let startIndex = j;
    while (j < content.length) {
        if (content[j] === '[') bracketCount++;
        else if (content[j] === ']') bracketCount--;
        
        if (bracketCount === 0) {
            break;
        }
        j++;
    }
    
    const arrayStr = content.slice(startIndex, j + 1);
    const expandedStr = getExpandedQuestionsString(arrayStr);
    
    result += content.slice(i, startIndex) + expandedStr;
    i = j + 1;
}

fs.writeFileSync(filePath, result, 'utf-8');
console.log('Successfully expanded questions in', filePath);
