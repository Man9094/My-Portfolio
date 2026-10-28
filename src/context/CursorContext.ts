import { createContext, useContext } from 'react';

export type CursorVariant = 'default' | 'project' | 'button' | 'hidden';

export interface CursorContextType {
  cursorVariant: CursorVariant;
  cursorText: string;
  setCursorVariant: (variant: CursorVariant, text?: string) => void;
  resetCursor: () => void;
}

export const CursorContext = createContext<CursorContextType>({
  cursorVariant: 'default',
  cursorText: '',
  setCursorVariant: () => {},
  resetCursor: () => {},
});

export const useCursor = () => useContext(CursorContext);
