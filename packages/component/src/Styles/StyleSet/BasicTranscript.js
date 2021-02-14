/* eslint no-magic-numbers: ["error", { "ignore": [2] }] */

export default function createBasicTranscriptStyleSet({
  paddingRegular,
  primaryFont,
  transcriptActivityVisualKeyboardIndicatorColor,
  transcriptActivityVisualKeyboardIndicatorStyle,
  transcriptActivityVisualKeyboardIndicatorWidth,
  transcriptTerminatorBackgroundColor,
  transcriptTerminatorBorderRadius,
  transcriptTerminatorColor,
  transcriptTerminatorFontSize,
  transcriptVisualKeyboardIndicatorColor,
  transcriptVisualKeyboardIndicatorStyle,
  transcriptVisualKeyboardIndicatorWidth
}) {
  return {
    '&.webchat__basic-transcript': {
      '&:focus': {
        outline: 0,

        '& .webchat__basic-transcript__activity-indicator.webchat__basic-transcript__activity-indicator--focus': {
          borderColor: transcriptActivityVisualKeyboardIndicatorColor,
          borderStyle: transcriptActivityVisualKeyboardIndicatorStyle,
          borderWidth: transcriptActivityVisualKeyboardIndicatorWidth,
          boxSizing: 'border-box',
          height: `calc(100% - ${paddingRegular}px)`,
          left: 0,
          margin: paddingRegular / 2,
          pointerEvents: 'none',
          position: 'absolute',
          top: 0,
          width: `calc(100% - ${paddingRegular}px)`
        }
      },

      '&:focus .webchat__basic-transcript__focus-indicator, .webchat__basic-transcript__terminator:focus + .webchat__basic-transcript__focus-indicator': {
        height: '100%',
        borderColor: transcriptVisualKeyboardIndicatorColor,
        borderStyle: transcriptVisualKeyboardIndicatorStyle,
        borderWidth: transcriptVisualKeyboardIndicatorWidth,
        boxSizing: 'border-box',
        pointerEvents: 'none',
        position: 'absolute',
        top: 0,
        width: '100%'
      },

      '& .webchat__basic-transcript__activity': {
        paddingTop: paddingRegular,
        position: 'relative',

        '&:not(:first-child)': {
          marginTop: -paddingRegular
        }
      },

      '& .webchat__basic-transcript__activity-box:not(:empty)': {
        paddingBottom: paddingRegular
      },

      '& .webchat__basic-transcript__activity-sentinel': {
        height: '100%',
        left: 0,
        pointerEvents: 'none',
        position: 'absolute',
        top: 0,
        width: '100%'
      },

      '& .webchat__basic-transcript__terminator': {
        bottom: 0,
        height: 0,
        outline: 0,
        position: 'relative',
        width: '100%'
      },

      '& .webchat__basic-transcript__terminator-body': {
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        position: 'absolute',
        width: '100%'
      },

      '& .webchat__basic-transcript__terminator:not(:focus) .webchat__basic-transcript__terminator-body': {
        display: 'none'
      },

      '& .webchat__basic-transcript__terminator-text': {
        backgroundColor: transcriptTerminatorBackgroundColor,
        borderRadius: transcriptTerminatorBorderRadius,
        color: transcriptTerminatorColor,
        fontFamily: primaryFont,
        fontSize: transcriptTerminatorFontSize,
        margin: paddingRegular / 2,
        padding: paddingRegular / 2
      }
    }
  };
}
