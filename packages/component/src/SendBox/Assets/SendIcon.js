import { css } from 'glamor';
import React from 'react';

import useDirection from '../../hooks/useDirection';

const SendIcon = () => {
  const [direction] = useDirection();
  const rtlScale = direction === 'rtl' ? css({ transform: 'scale(-1)' }) : '';

  return (
    <svg className={rtlScale} height={28} viewBox="0 0 45.7 33.8" width={28}>
      <path
        clipRule="evenodd"
        d="M8.55 25.25l21.67-7.25H11zm2.41-9.47h19.26l-21.67-7.23zm-6 13l4-11.9L5 5l35.7 11.9z"
      />
    </svg>
  );
};

export default SendIcon;
