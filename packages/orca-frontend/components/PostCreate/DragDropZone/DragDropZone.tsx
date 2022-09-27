import React, { ChangeEvent, FC } from 'react';
import { MultipleMediaIcon } from '../../ui/icons';

import { Container, Input, Parraf, RoundedButton, Title } from './style';

interface DragDropZoneProps {
  handleChange: (e: ChangeEvent) => void;
}

const DragDropZone: FC<DragDropZoneProps> = ({ handleChange }) => {
  return (
    <Container>
      <RoundedButton>
        <MultipleMediaIcon />
      </RoundedButton>

      <Title>Add Photos/Videos</Title>
      <Parraf>or drag and drop</Parraf>

      <Input
        type="file"
        multiple
        accept="image/x-png,image/jpeg,video/mp4,video/x-m4v,video/*"
        onChange={handleChange}
      />
    </Container>
  );
};

export default DragDropZone;
