import { ChangeEvent, FC, FormEvent, useState, Fragment } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQueryClient } from 'react-query';
import { RootState } from '../../store';
import { AlertTypes, openAlert } from '../../store/alert';
import { updateCache } from './cache';

import { PostLimits, Channel, ExistingMediaProps } from '../../constants';
import PreviewUploadFiles from './PreviewUploadFiles/PreviewUploadFiles';
import PostImageUpload from './PostImageUpload';
import DragDropZone from './DragDropZone/DragDropZone';
import { MediaZone, Options, OptionsText, Group, SelectContainer, RoundedButton } from './style';
import { TextAreaAutoSize, Spacing, Button, Modal, Select, Avatar } from '../ui';
import { PhoneIcon } from '../ui/icons';

const config = {
  headers: {
    'content-type': 'multipart/form-data',
  },
};

const createPost = async ({ title, media, channelId }) => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('channelId', channelId);

  for (const file of media) {
    formData.append('media', file);
  }

  const newPost = await axios.post('/posts/create', formData, config);
  return newPost.data;
};

const updatePost = async ({ postId, title, media, mediaToDeletePublicId, channelId }) => {
  const formData = new FormData();
  formData.append('postId', postId);
  formData.append('title', title);
  formData.append('channelId', channelId);
  formData.append('mediaToDeletePublicId', JSON.stringify(mediaToDeletePublicId));

  for (const file of media) {
    formData.append('media', file);
  }

  const updatedPost = await axios.put('/posts/update', formData, config);
  return updatedPost.data;
};

interface PostCreateProps {
  isPostCreateOpen: boolean;
  postId?: string;
  postTitle?: string;
  postImage?: string;
  postMedia?: ExistingMediaProps[];
  postImagePublicId?: string;
  channelId?: string;
  queryKey: any;
  closePostCreate: () => void;
}

const PostCreate: FC<PostCreateProps> = ({
  isPostCreateOpen,
  closePostCreate,
  channelId,
  postId,
  postTitle,
  postMedia,
  queryKey,
}) => {
  const authUser = useSelector((state: RootState) => state.auth.user);
  const queryClient = useQueryClient();
  const channels: Channel[] = queryClient.getQueryData(['channels']);
  const dispatch = useDispatch();
  const initialState = {
    title: postTitle || '',
    channelId: channelId ? channelId : channels && channels[0]?._id,
    media: [],
  };

  const [formValues, setFormValues] = useState<{ title: string; channelId: string; media: Array<File> }>(initialState);
  const [mediaToDeletePublicId, setMediaToDeletePublicId] = useState<Array<string>>([]);
  const [existingPostMedia, setExistingPostMedia] = useState(postMedia || []);

  const { mutateAsync: createPostMutation, isLoading: isPostCreateLoading } = useMutation(createPost);
  const { mutateAsync: updatePostMutation, isLoading: isPostUpdateLoading } = useMutation(updatePost);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // If we don't have a post id, it means we need to create one.
      if (!postId) {
        const post = await createPostMutation({
          channelId: formValues.channelId,
          media: formValues.media,
          title: formValues.title,
        });
        updateCache({
          queryKey,
          operation: 'create',
          queryClient,
          post,
          notAddingToCurrentChannel: channelId !== formValues.channelId,
        });
        notify('added');
        close();
      } else {
        const updatedPost = await updatePostMutation({
          postId,
          mediaToDeletePublicId,
          title: formValues.title,
          media: formValues.media,
          channelId: formValues.channelId,
        });
        updateCache({
          queryKey,
          operation: 'update',
          queryClient,
          post: updatedPost,
          notAddingToCurrentChannel: channelId !== formValues.channelId,
        });
        notify('updated');
        close();
      }
    } catch (error) {
      console.error('An error occurred while creating a post: ', error);
    }
  };

  const notify = (operation: 'added' | 'updated') => {
    const channel = channels.find((c) => c._id === formValues.channelId);
    const addedMessage = `The Post has been successfully added to the ${channel.name} channel.`;
    const updatedMessage = 'The Post has been successfully updated.';
    dispatch(
      openAlert({
        type: AlertTypes.Success,
        message: operation === 'added' ? addedMessage : updatedMessage,
      })
    );
  };

  const close = () => {
    setFormValues(initialState);
    closePostCreate();
  };

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormValues({ ...formValues, [name]: value });
  };

  const isFormValid = () => {
    const { title, media } = formValues;
    return title || media.length;
  };

  const handlePostImageUpload = (e: ChangeEvent) => {
    const media = [...formValues.media];
    const files = (e.target as HTMLInputElement).files;

    if (!files.length) return;

    if (files.length > PostLimits.maxFilesLength || formValues.media.length > PostLimits.maxFilesLength) {
      alert(`You cannot exceed the allowed limit of ${PostLimits.maxFilesLength} files`);
      (e.target as HTMLInputElement).value = null;
      return;
    }

    for (let i = 0; i < files.length; ++i) {
      const file = files[i];

      if (file.type.includes('image')) {
        if (file.size <= PostLimits.maxImageSize) {
          media.push(file);
        } else {
          alert(`The image size should be less than ${PostLimits.maxImageSize / 1000000}MB`);
          (e.target as HTMLInputElement).value = null;
          return;
        }
      } else if (file.type.includes('video')) {
        if (file.size <= PostLimits.maxVideoSize) {
          media.push(file);
        } else {
          alert(`The video size should be less than ${PostLimits.maxVideoSize / 1000000}MB`);
          (e.target as HTMLInputElement).value = null;
          return;
        }
      }
    }

    setFormValues({ ...formValues, media: media });
    (e.target as HTMLInputElement).value = null;
  };

  const deleteImageUpload = (file, from: string) => {
    if (from === 'newMedia') {
      setFormValues({
        ...formValues,
        media: formValues.media.filter((item) => item.name !== file.name),
      });
    }

    if (from === 'existingMedia') {
      setExistingPostMedia(existingPostMedia.filter((item) => item.publicId !== file.publicId));
      setMediaToDeletePublicId([...mediaToDeletePublicId, file.publicId]);
    }
  };

  const renderMediaZone = () => {
    if (formValues.media.length || existingPostMedia.length) {
      return (
        <PreviewUploadFiles newMedia={formValues.media} existingMedia={existingPostMedia} onClick={deleteImageUpload} />
      );
    } else {
      return <DragDropZone handleChange={handlePostImageUpload} />;
    }
  };

  return (
    <Modal title={postId ? 'Edit Post' : 'Create Post'} isOpen={isPostCreateOpen} close={close}>
      <form onSubmit={handleSubmit}>
        <SelectContainer>
          <Avatar size={1.25} image={authUser.image} />
          <Spacing left="sm">
            <Select onChange={handleChange} name="channelId" defaultValue={channelId && channelId}>
              {channels?.map((channel: Channel) => (
                <Fragment key={channel._id}>
                  <option value={channel._id}>{channel.name}</option>
                </Fragment>
              ))}
            </Select>
          </Spacing>
        </SelectContainer>

        <Spacing top="xs" bottom="xxs">
          <TextAreaAutoSize
            name="title"
            autoFocus
            onChange={handleChange}
            value={formValues.title}
            placeholder={`What do you want to talk about, ${authUser.fullName}?`}
          />
        </Spacing>

        <MediaZone>
          {renderMediaZone()}

          <Options>
            <Group>
              <RoundedButton>
                <PhoneIcon />
              </RoundedButton>
              <OptionsText>
                Add photos and videos from your device. {formValues.media.length + existingPostMedia.length}/
                {PostLimits.maxFilesLength}
              </OptionsText>
            </Group>

            <PostImageUpload label="Add " handleChange={handlePostImageUpload} />
          </Options>
        </MediaZone>

        <Button
          fullWidth
          type="submit"
          color="primary"
          disabled={!isFormValid() || isPostCreateLoading || isPostUpdateLoading}
        >
          {postId ? 'Update' : 'Post'}
        </Button>
      </form>
    </Modal>
  );
};

export default PostCreate;
