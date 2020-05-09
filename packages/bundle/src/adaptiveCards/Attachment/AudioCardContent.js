/* eslint react/no-array-index-key: "off" */

import { Components, hooks } from 'botframework-webchat-component';
import PropTypes from 'prop-types';
import React from 'react';

import CommonCard from './CommonCard';

const { AudioContent } = Components;
const { useStyleSet } = hooks;

const AudioCardContent = ({ content, disabled }) => {
  const [{ audioCardAttachment: audioCardAttachmentStyleSet }] = useStyleSet();
  const { autostart = false, autoloop = false, image: { url: imageURL = '' } = {}, media = [] } = content;

  return (
    <div className={audioCardAttachmentStyleSet}>
      <ul className="media-list">
        {media.map(({ url }, index) => (
          <li key={index}>
            <AudioContent autoPlay={autostart} loop={autoloop} poster={imageURL} src={url} />
          </li>
        ))}
      </ul>
      <CommonCard attachment={attachment} />
    </div>
  );
};

AudioCardContent.defaultProps = {
  disabled: undefined
};

AudioCardContent.propTypes = {
  content: PropTypes.shape({
    autostart: PropTypes.bool,
    autoloop: PropTypes.bool,
    image: PropTypes.shape({
      url: PropTypes.string.isRequired
    }),
    media: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired
      }).isRequired
    ).isRequired
  }).isRequired,
  disabled: PropTypes.bool
};

export default AudioCardContent;
