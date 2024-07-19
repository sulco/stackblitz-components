import { useSimpleEditor } from '@hooks/useSimpleEditor.js';
import CodeMirrorEditor from '@tutorialkit/components-react/core/CodeMirrorEditor';
import FileTree from '@tutorialkit/components-react/core/FileTree';
import { lazy, Suspense, useEffect, useState } from 'react';

const Terminal = lazy(() => import('@tutorialkit/components-react/core/Terminal'));

export function SimpleEditor() {
  const [domLoaded, setDomLoaded] = useState(false);

  const { setTerminal, previewSrc, document, files, onChange, onScroll, selectedFile, setSelectedFile } =
    useSimpleEditor();

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  return (
    <div className="max-w-screen-lg mx-auto">
      <div className="mx-4 my-4 h-[calc(100vh-2rem)] flex flex-col border border-gray-200 border-solid rounded-xl overflow-hidden">
        <div className="flex h-1/2">
          <FileTree
            className="w-1/4 flex-shrink-0 text-sm mt-2"
            files={files}
            hideRoot
            selectedFile={selectedFile}
            onFileSelect={setSelectedFile}
          />
          <CodeMirrorEditor
            theme="light"
            doc={document}
            onChange={onChange}
            onScroll={onScroll}
            className="h-full flex-grow max-w-[calc(75%-1px)] text-[13px] border-l-1 border-l-gray-200"
          />
        </div>
        <div className="flex p-0 m-0 h-1/2 border-t-1 border-t-gray-200">
          <div className="w-1/2 h-full">
            {domLoaded && (
              <Suspense>
                <Terminal className="h-full" readonly={false} theme="light" onTerminalReady={setTerminal} />
              </Suspense>
            )}
          </div>
          <iframe className="w-1/2 h-full border-l-1 border-l-gray-200" src={previewSrc} />
        </div>
      </div>
    </div>
  );
}


