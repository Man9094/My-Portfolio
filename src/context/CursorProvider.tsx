import { useState, type ReactNode } from 'react';
import { CursorContext, type CursorVariant } from './CursorContext';

export const CursorProvider = ({ children }: { children: ReactNode }) => {
  const [cursorVariant, setVariant] = useState<CursorVariant>('default');
  const [cursorText, setText] = useState<string>('');

  const setCursorVariant = (variant: CursorVariant, text: string = '') => {
    setVariant(variant);
    setText(text);
  };

  const resetCursor = () => {
    setVariant('default');
    setText('');
  };

  return (
    <CursorContext.Provider value={{ cursorVariant, cursorText, setCursorVariant, resetCursor }}>
      {children}
    </CursorContext.Provider>
  );
};
