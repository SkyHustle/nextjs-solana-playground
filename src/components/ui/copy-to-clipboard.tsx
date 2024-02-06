import { useState } from "react";
import { ClipboardIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/20/solid";

export function CopyToClipboard({ copyText }: { copyText: string }) {
  const [isCopied, setIsCopied] = useState(false);

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      console.log(`Copied ${text} to clipboard`);
      // alert("Copied to clipboard"); // Optionally, show some feedback
      // Toast this shit!
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  }

  return (
    <>
      {isCopied ? (
        <CheckIcon className="flex-shrink-0 h-6 w-6 text-gray-400" />
      ) : (
        <button
          onClick={() => copyToClipboard(copyText)}
          className="flex-shrink-0 h-6 w-6 text-gray-400 hover:text-indigo-500 hover:cursor-pointer"
          aria-hidden="true"
          title="Copy to clipboard"
        >
          <ClipboardIcon />
        </button>
      )}
    </>
  );
}
