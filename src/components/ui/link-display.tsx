export function ExplorerLink({ path, label, className }: { path: string; label: string; className?: string }) {
  return (
    <a
      href={`https://explorer.solana.com/${path}?cluster=devnet`}
      target="_blank"
      rel="noopener noreferrer"
      className={className ? className : `link font-mono`}
    >
      {label}
    </a>
  );
}

export function Ellipsify(str = "", len = 4) {
  if (str.length > 30) {
    return str.substring(0, len) + "...." + str.substring(str.length - len, str.length);
  }
  return str;
}
