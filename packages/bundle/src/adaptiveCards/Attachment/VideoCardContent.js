/* eslint react/no-array-index-key: "off" */

import { Components, hooks } from 'botframework-webchat-component';
import PropTypes from 'prop-types';
import React from 'react';

import CommonCard from './CommonCard';

const { useStyleSet } = hooks;
const { VideoContent } = Components;

const VideoCardContent = ({ content, disabled }) => {
  const { media, autostart, autoloop, image: { url: imageURL } = {} } = content;
  const [{ audioCardAttachment: audioCardAttachmentStyleSet }] = useStyleSet();

  return (
    <div className={audioCardAttachmentStyleSet}>
      <ul className="media-list">
        {media.map(({ url }, index) => (
          <li key={index}>
            <VideoContent autoPlay={autostart} loop={autoloop} poster={imageURL} src={url} />
          </li>
        ))}
      </ul>
      <CommonCard attachment={attachment} />
    </div>
  );
};

VideoCardContent.defaultProps = {
  disabled: undefined
};

VideoCardContent.propTypes = {
  content: PropTypes.shape({
    autoloop: PropTypes.bool,
    autostart: PropTypes.bool,
    image: PropTypes.shape({
      url: PropTypes.string
    }),
    media: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string
      })
    )
  }).isRequired,
  disabled: PropTypes.bool
};

export default VideoCardContent;
