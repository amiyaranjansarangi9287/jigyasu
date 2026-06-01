type Props = { size?: number; className?: string };

export default function OwlLogo({ size = 40, className = "" }: Props) {
  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      style={{ fontSize: size }}
      aria-hidden="true"
    >
      🦚
    </span>
  );
}
