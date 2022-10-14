
// sprocs.js //////////////////////////////////////////////////////////////////

const fs = require('fs');

///////////////////////////////////////////////////////////////////////////////

const lineswithstatusfilename = 'lineswithstatus.txt';
const lineswithstatus = [];

const patternoutliersfilename = 'patternoutliersfilename.txt';
const patternoutliers = [];

const allmatchesfilename = 'allmatches.json';
const allmatches = [];

procedurecount = 0;
linecount = 0;

///////////////////////////////////////////////////////////////////////////////

const db_json = JSON.parse(fs.readFileSync('sprocs.json', 'utf-8'));

///////////////////////////////////////////////////////////////////////////////

for (let i = 0; i < db_json.data.length; i++) {
    procedurecount++;
    const procedureName = db_json.data[i][0];
    const proc = db_json.data[i][1];
    const lines = proc.split('\r\n');
    for (let j = 0; j < lines.length; j++) {
        linecount++;
        if (lines[j].includes('INTEGR_REC_STATUS')) {
            const lineText = lines[j];
            const lineNumber = j + 1;
            const referenceText =
                lineInfo(lineNumber, procedureName, lineText);

            const matches =
                [...lineText
                    .matchAll(/INTEGR_REC_STATUS\s*(?:<>|=)\s*'(\w+)'/g)];

            if (matches.length > 0) {
                allmatches.push(matches);
            } else {
                patternoutliers.push(referenceText);
            }


            lineswithstatus.push(referenceText);
        }
    }
}

///////////////////////////////////////////////////////////////////////////////

fs.writeFileSync(lineswithstatusfilename, lineswithstatus.join('\n'));
fs.writeFileSync(patternoutliersfilename, patternoutliers.join('\n'));
fs.writeFileSync(allmatchesfilename, JSON.stringify(allmatches, null, 4));

///////////////////////////////////////////////////////////////////////////////

console.log(`${linecount} lines checked over ${procedurecount} procedures.`);
console.log([...new Set(allmatches.flat().map(m => m[1]))].sort());

///////////////////////////////////////////////////////////////////////////////

function lineInfo(pLineNumber, pProcedureName, pLineText) {
    return `ln: ${pLineNumber} - ${pProcedureName}: ${pLineText}`
}

///////////////////////////////////////////////////////////////////////////////
