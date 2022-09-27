import React, { FC } from 'react';
import { CloseIcon } from '../../ui/icons';
import { PreviewContainer, MediaContainer, ImagePreview, VideoPreview, CloseButton } from './style';

interface ExistingMediaProps {
  type: string;
  url: string;
  publicId: string;
}

interface PeviewUploadFilesProps {
  newMedia?: any;
  existingMedia?: ExistingMediaProps[];
  onClick: (a, b) => void;
}

const PeviewUploadFiles: FC<PeviewUploadFilesProps> = ({ newMedia, existingMedia, onClick }) => {
  const media = [...existingMedia, ...newMedia];

  return (
    <PreviewContainer>
      {media.map((item, index) => {
        const from = item.url ? 'existingMedia' : 'newMedia';
        const src = item.url ? item.url : URL.createObjectURL(item);

        if (item.type.includes('image')) {
          return (
            <MediaContainer key={index}>
              <CloseButton onClick={() => onClick(item, from)} type="button">
                <CloseIcon width="10" />
              </CloseButton>

              <ImagePreview src={src} />
            </MediaContainer>
          );
        } else {
          return (
            <MediaContainer>
              <CloseButton onClick={() => onClick(item, from)} type="button">
                <CloseIcon width="10" />
              </CloseButton>

              <VideoPreview src={src} controls />
            </MediaContainer>
          );
        }
      })}
    </PreviewContainer>
  );
};

export default PeviewUploadFiles;
