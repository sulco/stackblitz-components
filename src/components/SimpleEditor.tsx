import { useSimpleEditor } from '@hooks/useSimpleEditor.js';
import CodeMirrorEditor from '@tutorialkit/components-react/core/CodeMirrorEditor';
import FileTree from '@tutorialkit/components-react/core/FileTree';
import { lazy, Suspense, useEffect, useState } from 'react';

const Terminal = lazy(
  () => import('@tutorialkit/components-react/core/Terminal'),
);

export function SimpleEditor() {
  const [domLoaded, setDomLoaded] = useState(false);

  const {
    setTerminal,
    previewSrc,
    document,
    files,
    onChange,
    onScroll,
    selectedFile,
    setSelectedFile,
  } = useSimpleEditor();

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  return (
    <div className="w-full h-full overflow-hidden grid grid-rows-2 grid-cols-10 border-1 border-gray-200 rounded-xl">
      <FileTree
        className="grid-col-span-2 text-sm mt-2"
        files={files}
        hideRoot
        selectedFile={selectedFile}
        onFileSelect={setSelectedFile}
      />
      <CodeMirrorEditor
        className="grid-col-span-8 w-full text-[13px] border-l-1 border-l-gray-200"
        theme="light"
        doc={document}
        onChange={onChange}
        onScroll={onScroll}
      />
      {domLoaded && (
        <Suspense>
          <Terminal
            className="grid-col-span-3 border-t-1 border-t-gray-200"
            readonly={false}
            theme="light"
            onTerminalReady={setTerminal}
          />
        </Suspense>
      )}
      <iframe
        className="grid-col-span-7 border-l-1 w-full h-full border-l-gray-200 border-t-1 border-t-gray-200"
        src={previewSrc}
      />
    </div>
  );
}
