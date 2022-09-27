import React, { ChangeEvent, FC } from 'react';
import styled from 'styled-components';

const Input = styled.input`
  display: none;
`;

const Label = styled.label`
  cursor: pointer;
  padding: 9px 14px;
  transition: background-color 0.1s;
  font-weight: ${(p) => p.theme.font.weight.bold};
  border-radius: ${(p) => p.theme.radius.sm};
  background-color: ${(p) => p.theme.colors.grey[30]};
  font-size: ${(p) => p.theme.font.size.xxs};
  &:hover {
    background-color: ${(p) => p.theme.colors.grey[40]};
  }
`;

interface PostImageUploadProps {
  handleChange: (e: ChangeEvent) => void;
  label?: string;
}

const PostImageUpload: FC<PostImageUploadProps> = ({ handleChange, label }) => (
  <>
    <Input
      name="image"
      onChange={handleChange}
      type="file"
      id="post-image"
      multiple
      accept="image/x-png,image/jpeg,video/mp4,video/x-m4v,video/*"
    />

    <Label htmlFor="post-image">{label && label}</Label>
  </>
);

export default PostImageUpload;
