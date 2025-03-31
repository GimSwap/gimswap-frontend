import { useRef, useState } from 'react';

export const useInputFocus = () => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    if (isFocused) return;
    setIsFocused(true);
    inputRef.current?.focus();
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return { isFocused, handleFocus, handleBlur, inputRef };
};
