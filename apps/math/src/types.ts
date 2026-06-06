export interface CanvasProps {
  isPlaying?: boolean;
  selectedPart?: string;
  className?: string;
  onInteract?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}