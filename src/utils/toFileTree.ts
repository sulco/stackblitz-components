import type { EditorDocument } from '@tutorialkit/components-react/core';
import type { DirectoryNode, FileSystemTree } from '@webcontainer/api';

export function toFileTree(
  files: Record<string, EditorDocument>,
): FileSystemTree {
  const root: FileSystemTree = {};

  for (const filePath in files) {
    const segments = filePath.split('/').filter((segment) => segment);

    let currentTree: FileSystemTree = root;

    for (let i = 0; i < segments.length; ++i) {
      const name = segments[i];

      if (i === segments.length - 1) {
        currentTree[name] = {
          file: {
            contents: files[filePath].value,
          },
        };
      } else {
        let folder = currentTree[name] as DirectoryNode;

        if (!folder) {
          folder = {
            directory: {},
          };

          currentTree[name] = folder;
        }

        currentTree = folder.directory;
      }
    }
  }

  return root;
}
