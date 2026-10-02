const fs = require('fs');

const html = fs.readFileSync('screen.html', 'utf-8');

const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
if (bodyMatch) {
  let jsx = bodyMatch[1]
    .replace(/class="/g, 'className="')
    .replace(/stroke-width/g, 'strokeWidth')
    .replace(/stroke-linecap/g, 'strokeLinecap')
    .replace(/stroke-linejoin/g, 'strokeLinejoin')
    .replace(/stop-color/g, 'stopColor')
    .replace(/stop-opacity/g, 'stopOpacity')
    .replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}')
    .replace(/(<path [^>]*[^\/])>/g, '$1 />')
    .replace(/(<line [^>]*[^\/])>/g, '$1 />')
    .replace(/(<polyline [^>]*[^\/])>/g, '$1 />')
    .replace(/(<circle [^>]*[^\/])>/g, '$1 />')
    .replace(/<br>/g, '<br />')
    .replace(/<hr>/g, '<hr />')
    .replace(/(<input[^>]*[^\/])>/g, '$1 />')
    .replace(/(<img[^>]*[^\/])>/g, '$1 />');

  fs.writeFileSync('src/App.jsx', "import React from 'react';\n\nexport default function App() {\n  return (\n    <div className=\"bg-[#07090D] text-slate-200 font-sans antialiased relative min-h-screen overflow-x-hidden\">\n" + jsx + "\n    </div>\n  );\n}\n");
}

const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/i);
if (styleMatch) {
  fs.appendFileSync('src/index.css', '\n/* Custom styles from screen.html */\n@layer utilities {\n' + styleMatch[1] + '\n}\n');
}
console.log('Done!');
