const fs = require('fs');
const path = require('path');

const localesPath = path.join(__dirname, '../src/locales');
const languages = ['en', 'hu'];

function sortObjectKeys(obj) {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return obj;
  }
  
  const sorted = {};
  Object.keys(obj)
    .sort()
    .forEach(key => {
      sorted[key] = sortObjectKeys(obj[key]);
    });
  
  return sorted;
}

languages.forEach(lang => {
  const filePath = path.join(localesPath, lang, 'translation.json');
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(content);
    const sorted = sortObjectKeys(json);
    
    fs.writeFileSync(
      filePath,
      JSON.stringify(sorted, null, 2) + '
',
      'utf8'
    );
    
    console.log(`✓ Sorted ${lang}/translation.json`);
  } catch (error) {
    console.error(`✗ Error processing ${lang}/translation.json:`, error.message);
  }
});

console.log('
Translation files sorted successfully!');
