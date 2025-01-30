const fs = require('fs');
const path = require('path');
const asciidoctor = require('asciidoctor')();

function convertAsciiDocToJSON(asciidocContent, filePath) {
    // Parse the AsciiDoc content
    const doc = asciidoctor.load(asciidocContent);

    // Extract document metadata and content
    return {
        filePath: path.relative(process.cwd(), filePath),
        title: doc.getDocumentTitle(),
        attributes: doc.getAttributes(),
        blocks: parseBlocks(doc)
    };
}

function parseBlocks(doc) {
    return doc.getBlocks().map(block => {
        const blockData = {
//            context: block.getContext(),
            content: block.getContent(),
            attributes: block.getAttributes()
        };

        if (block.getBlocks().length > 0) {
            blockData.blocks = parseBlocks(block); // Recursively process nested blocks
        }

        return blockData;
    });
}

function processFolderRecursively(folderPath) {
    const results = [];

    function walkDirectory(currentPath) {
        const entries = fs.readdirSync(currentPath, { withFileTypes: true });

        entries.forEach(entry => {
            const fullPath = path.join(currentPath, entry.name);
            if (entry.isDirectory()) {
                walkDirectory(fullPath); // Recurse into subdirectory
            } else if (entry.isFile() && entry.name.endsWith('.adoc')) {
                const content = fs.readFileSync(fullPath, 'utf8');
                const jsonContent = convertAsciiDocToJSON(content, fullPath);
                results.push(jsonContent);
            }
        });
    }

    walkDirectory(folderPath);
    return results;
}

// Main script
const inputFolder = './docs'; // Replace with your AsciiDoc folder
const outputFilePath = './output.json';

try {
    const jsonResult = processFolderRecursively(inputFolder);

    fs.writeFileSync(outputFilePath, JSON.stringify(jsonResult, null, 2), 'utf8');
    console.log(`Conversion successful! Combined JSON saved to ${outputFilePath}`);
} catch (error) {
    console.error('An error occurred:', error.message);
}
