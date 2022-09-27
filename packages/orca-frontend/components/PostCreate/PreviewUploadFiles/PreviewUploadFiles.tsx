import React, { FC } from 'react';
import { CloseIcon } from '../../ui/icons';
import { PreviewContainer, MediaContainer, ImagePreview, VideoPreview, CloseButton } from './style';

interface ExistingMediaProps {
  type: string;
  url: string;
  publicId: string;
}

interface PeviewUploadFilesProps {
  newMedia?: Array<File>;
  existingMedia?: ExistingMediaProps[];
  onClick: (a, b) => void;
}

const PeviewUploadFiles: FC<PeviewUploadFilesProps> = ({ newMedia, existingMedia, onClick }) => {
  return (
    <PreviewContainer>
      {existingMedia.map((item, index) => {
        if (item.type.includes('image')) {
          return (
            <MediaContainer key={index}>
              <CloseButton onClick={() => onClick(item, 'existingMedia')} type="button">
                <CloseIcon width="10" />
              </CloseButton>

              <ImagePreview src={item.url} />
            </MediaContainer>
          );
        } else {
          return (
            <MediaContainer>
              <CloseButton onClick={() => onClick(item, 'existingMedia')} type="button">
                <CloseIcon width="10" />
              </CloseButton>

              <VideoPreview src={item.url} controls />
            </MediaContainer>
          );
        }
      })}

      {newMedia.map((item, index) => {
        if (item.type.includes('image')) {
          return (
            <MediaContainer key={index}>
              <CloseButton onClick={() => onClick(item, 'newMedia')} type="button">
                <CloseIcon width="10" />
              </CloseButton>

              <ImagePreview src={URL.createObjectURL(item)} />
            </MediaContainer>
          );
        } else {
          return (
            <MediaContainer>
              <CloseButton onClick={() => onClick(item, 'newMedia')} type="button">
                <CloseIcon width="10" />
              </CloseButton>

              <VideoPreview src={URL.createObjectURL(item)} controls />
            </MediaContainer>
          );
        }
      })}
    </PreviewContainer>
  );
};

export default PeviewUploadFiles;
