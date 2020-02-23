export default function createAvatarStyle({ avatarSize }) {
  return {
    borderRadius: '50%',
    height: avatarSize,
    overflow: 'hidden',
    width: avatarSize
  };
}
