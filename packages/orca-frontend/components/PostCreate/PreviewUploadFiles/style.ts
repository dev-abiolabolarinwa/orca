import styled from 'styled-components';

export const PreviewContainer = styled.div`
  display: flex;
  gap: 15px;
  width: 100%;
  overflow-y: hidden;
  flex-shrink: 0;
  overflow-x: auto;
`;

export const MediaContainer = styled.div`
  position: relative;
`;

export const ImagePreview = styled.img`
  width: fit-content;
  min-width: 40px;
  max-width: 230px;
  height: 150px;
  object-fit: cover;
  border-radius: ${(p) => p.theme.radius.sm};
`;

export const VideoPreview = styled.video`
  width: fit-content;
  max-width: 230px;
  height: 150px;
  object-fit: cover;
  border-radius: ${(p) => p.theme.radius.sm};
  cursor: pointer;
`;

export const CloseButton = styled.button`
  display: flex;
  position: absolute;
  right: 5px;
  top: 5px;
  cursor: pointer;
  background-color: ${(p) => p.theme.colors.general.white};
  border: 1px solid ${(p) => p.theme.colors.grey[50]};
  border-radius: ${(p) => p.theme.radius.lg};
  padding: ${(p) => p.theme.spacing.xxs} ${(p) => p.theme.spacing.xxs} ${(p) => p.theme.spacing.xxs}
    ${(p) => p.theme.spacing.xxs};
  z-index: 1;
  &:hover {
    background-color: ${(p) => p.theme.colors.grey[10]};
  }
`;
