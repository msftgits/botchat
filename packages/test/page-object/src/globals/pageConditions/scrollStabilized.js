import getTranscriptScrollableElement from '../pageElements/transcriptScrollable';
import stabilized from './stabilized';

export default async function scrollStabilized(scrollTop) {
  const transcriptScrollable = getTranscriptScrollableElement();

  if (typeof scrollTop === 'number') {
    return await stabilized(
      `scroll is at ${scrollTop}px and`,
      () => (transcriptScrollable.scrollTop === scrollTop ? scrollTop : {}),
      5,
      5000
    );
  } else {
    return await stabilized('scroll', () => transcriptScrollable.scrollTop, 5, 5000);
  }
}
