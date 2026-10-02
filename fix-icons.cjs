const fs = require('fs');
const path = require('path');
const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
};
const files = walk('./src');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  // Replace <span className="...material-symbols-outlined..."> with <span translate="no" className="..."
  let newContent = content.replace(/<span\s+(?:className=[\"'{`][^>]*?material-symbols-outlined[^>]*?[\"'}])(.*?)>/g, (match) => {
    if (match.includes('translate="no"')) return match;
    return match.replace('<span ', '<span translate="no" ');
  });
  
  if (content !== newContent) {
    fs.writeFileSync(f, newContent);
    console.log('Updated ' + f);
  }
});
