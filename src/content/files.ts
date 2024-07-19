import type { EditorDocument } from '@tutorialkit/components-react/core';

let FILES: Record<string, EditorDocument> = {};

[
  '/src/index.js',
  '/src/index.html',
  '/src/assets/logo.svg',
  '/package.json',
].forEach(async (filePath) => {
  console.log(filePath);

  FILES[filePath] = {
    filePath,
    loading: false,
    value: (await import(/* @vite-ignore */ `.${filePath}?raw&import`)).default,
  };
});

export { FILES };

