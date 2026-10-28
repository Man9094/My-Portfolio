import { useContext } from 'react';
import { CursorContext } from './CursorContext';

export const useCursor = () => useContext(CursorContext);
