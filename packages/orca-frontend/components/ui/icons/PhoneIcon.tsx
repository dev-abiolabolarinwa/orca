import React, { FC } from 'react';
import theme from '../../../theme';

interface PhoneIconProps {
  width?: string;
  color?: string;
}

const PhoneIcon: FC<PhoneIconProps> = ({ width, color }) => {
  const DEFAULT_WIDTH = '15';
  const DEFAULT_COLOR = theme.colors.grey[90];

  return (
    <svg width={width || DEFAULT_WIDTH} height="22" viewBox="0 0 22 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19.5556 0H2.44444C1.79614 0 1.17438 0.210714 0.715962 0.585786C0.257539 0.960859 0 1.46957 0 2V26C0 26.5304 0.257539 27.0391 0.715962 27.4142C1.17438 27.7893 1.79614 28 2.44444 28H19.5556C20.2039 28 20.8256 27.7893 21.284 27.4142C21.7425 27.0391 22 26.5304 22 26V2C22 1.46957 21.7425 0.960859 21.284 0.585786C20.8256 0.210714 20.2039 0 19.5556 0V0ZM12.2222 26H9.77778V24H12.2222V26ZM2.44444 22V2H19.5556V22H2.44444Z"
        fill={color || DEFAULT_COLOR}
      />
    </svg>
  );
};

export default PhoneIcon;
