export default function ({
  paddingRegular,
  transcriptOverlayButtonBackground,
  transcriptOverlayButtonBackgroundOnFocus,
  transcriptOverlayButtonBackgroundOnHover,
  transcriptOverlayButtonColor,
  transcriptOverlayButtonColorOnFocus,
  transcriptOverlayButtonColorOnHover
}) {
  return {
    backgroundColor: transcriptOverlayButtonBackground,
    borderRadius: paddingRegular,
    borderWidth: 0,
    bottom: 5,
    color: transcriptOverlayButtonColor,
    cursor: 'pointer',
    outline: 0,
    padding: paddingRegular,
    position: 'absolute',
    right: 20,

    '&:hover': {
      backgroundColor: transcriptOverlayButtonBackgroundOnHover,
      color: transcriptOverlayButtonColorOnHover
    },

    '&:focus': {
      backgroundColor: transcriptOverlayButtonBackgroundOnFocus,
      color: transcriptOverlayButtonColorOnFocus
    }
  };
}
