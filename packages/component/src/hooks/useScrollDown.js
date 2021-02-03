import { useCallback } from 'react';

import useScrollRelative from './internal/useScrollRelative';

export default function useScrollDown() {
  const scrollRelative = useScrollRelative();

  return useCallback(() => scrollRelative('down'), [scrollRelative]);
}
