import type {
  EditorDocument,
  EditorUpdate,
  ScrollPosition,
} from '@tutorialkit/components-react/core';
import { useState } from 'react';
import { useWebContainerBoot } from './useWebContainerBoot.js';

export function useEditor(
  files: Record<string, EditorDocument>,
  selected: string,
) {
  const webcontainerPromise = useWebContainerBoot();
  const [selectedFile, setSelectedFile] = useState(selected);
  const [documents, setDocuments] =
    useState<Record<string, EditorDocument>>(files);

  const document = documents[selectedFile];

  // Update the document value when the editor content changes
  async function onChange({ content }: EditorUpdate) {
    setDocuments((prevDocuments) => ({
      ...prevDocuments,
      [selectedFile]: {
        ...prevDocuments[selectedFile],
        value: content,
      },
    }));

    const webcontainer = await webcontainerPromise;

    await webcontainer.fs.writeFile(selectedFile, content);
  }

  // Remember the scroll position for each document
  function onScroll(scroll: ScrollPosition) {
    setDocuments((prevDocuments) => ({
      ...prevDocuments,
      [selectedFile]: {
        ...prevDocuments[selectedFile],
        scroll,
      },
    }));
  }

  return {
    selectedFile,
    setSelectedFile,
    onChange,
    onScroll,
    document,
  };
}
