"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

export function CopyApplicationButton({ text }: { text: string }) {
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied — paste it into an email to info@wisekew.com");
    } catch {
      toast.error("Couldn't copy automatically. Select the text below and copy it manually.");
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="mt-3 w-full gap-2 rounded-md"
      onClick={handleCopy}
    >
      <Copy className="h-4 w-4" />
      Copy application details
    </Button>
  );
}
