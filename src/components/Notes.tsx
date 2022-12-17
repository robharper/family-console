import { useEffect, useRef } from "react";
import Quill from "quill";
import XMarkIcon from '@heroicons/react/24/solid/XMarkIcon';
import 'quill/dist/quill.snow.css';
import './Notes.css';


export default function Notes({children}: {children?: JSX.Element[] | JSX.Element}) {
  const quillEl = useRef() as React.MutableRefObject<HTMLInputElement>;
  const boundEl = useRef() as React.MutableRefObject<HTMLInputElement>;
  const quill = useRef<Quill>();

  useEffect(() => {
    if (quillEl.current != null && quill.current == null) {
      quill.current = new Quill(quillEl.current, {
        bounds: boundEl.current,
        theme: 'snow',
        modules: {
          toolbar: false
        }
      });

      const content = localStorage.getItem('notes');
      if (content) {
        quill.current.setText(content);
      }

      quill.current.on('text-change', () => {
        if (quill.current) {
          localStorage.setItem('notes', quill.current?.getText());
        }
      })
    }
  }, []);

  const clear = () => {
    quill.current?.setText('');
  }

  return (
    <div className="w-full h-full p-2 bg-slate-300 rounded-xl flex flex-col">
      <div className="flex-none p-2 mb-2 relative">
        {children}
        <button onClick={clear} className="absolute top-0 right-2 w-6 h-full">
          <XMarkIcon/>
        </button>
      </div>

      <div ref={boundEl} className="flex-1 overflow-auto bg-white rounded-lg text-lg">
        <div ref={quillEl}></div>
      </div>
    </div>
  )
}