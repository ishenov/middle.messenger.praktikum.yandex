import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

export function load(url, context, nextLoad) {
  // Check if the import is for a Handlebars template
  if (url.endsWith('.hbs?raw') || url.endsWith('.hbs')) {
    // Convert the file URL to a file path, removing the '?raw' part
    const path = fileURLToPath(url.split('?')[0]);

    // Read the file's content
    const content = readFileSync(path, 'utf-8');

    return {
      format: 'module',
      shortCircuit: true,
      // Export the file content as a string default export
      source: `export default ${JSON.stringify(content)};`,
    };
  }

  // For all other file types, defer to the next loader in the chain
  return nextLoad(url, context);
}
