import type { EditorDocument } from '@tutorialkit/components-react/core';
import { toFileTree } from '@utils/toFileTree.js';
import { useState, useEffect } from 'react';
import { useWebContainerBoot } from './useWebContainerBoot.js';
import type { Terminal as XTerm } from '@xterm/xterm';

export function useWebContainer(files: Record<string, EditorDocument>) {
  const webcontainerPromise = useWebContainerBoot();
  const [terminal, setTerminal] = useState<XTerm | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string>('');

  useEffect(() => {
    (async () => {
      const webcontainer = await webcontainerPromise;

      webcontainer.on('server-ready', (_port, url) => {
        setPreviewSrc(url);
      });

      await webcontainer.mount(toFileTree(files));
    })();
  }, []);

  useEffect(() => {
    if (!terminal) {
      return;
    }

    run(terminal);

    async function run(terminal: XTerm) {
      const webcontainer = await webcontainerPromise;
      const process = await webcontainer.spawn('jsh', ['--osc'], {
        terminal: {
          cols: terminal.cols,
          rows: terminal.rows,
        },
      });

      let isInteractive = false;
      let resolveReady!: () => void;

      const jshReady = new Promise<void>((resolve) => {
        resolveReady = resolve;
      });

      process.output.pipeTo(
        new WritableStream({
          write(data) {
            if (!isInteractive) {
              const [, osc] = data.match(/\x1b\]654;([^\x07]+)\x07/) || [];

              if (osc === 'interactive') {
                // wait until we see the interactive OSC
                isInteractive = true;

                resolveReady();
              }
            }

            terminal.write(data);
          },
        }),
      );

      const shellWriter = process.input.getWriter();

      terminal.onData((data) => {
        if (isInteractive) {
          shellWriter.write(data);
        }
      });

      await jshReady;

      shellWriter.write('npm install && npm start\n');
    }
  }, [terminal]);

  return {
    setTerminal,
    previewSrc,
  };
}
