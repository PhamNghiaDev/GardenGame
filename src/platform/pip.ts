/** Capability check for the web platform adapter. Window lifecycle belongs to M7. */
export function isCompactWindowAvailable(): boolean {
  return typeof window !== 'undefined' && 'documentPictureInPicture' in window
}
