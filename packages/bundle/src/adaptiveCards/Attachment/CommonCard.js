import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import { hooks } from 'botframework-webchat-component';

import AdaptiveCardBuilder from './AdaptiveCardBuilder';
import AdaptiveCardRenderer from './AdaptiveCardRenderer';
import useAdaptiveCardsPackage from '../hooks/useAdaptiveCardsPackage';

const { useDirection, useStyleOptions } = hooks;

const CommonCard = ({ content, disabled }) => {
  const [adaptiveCardsPackage] = useAdaptiveCardsPackage();
  const [direction] = useDirection();
  const [styleOptions] = useStyleOptions();

  const builtCard = useMemo(() => {
    if (content) {
      const builder = new AdaptiveCardBuilder(adaptiveCardsPackage, styleOptions, direction);

      builder.addCommon(content);

      return builder.card;
    }
  }, [adaptiveCardsPackage, content, direction, styleOptions]);

  return <AdaptiveCardRenderer adaptiveCard={builtCard} disabled={disabled} tapAction={content && content.tap} />;
};

CommonCard.defaultProps = {
  disabled: undefined
};

CommonCard.propTypes = {
  content: PropTypes.shape({
    tap: PropTypes.any
  }).isRequired,
  disabled: PropTypes.bool
};

export default CommonCard;
