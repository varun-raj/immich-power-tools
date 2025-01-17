import React, { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogHeader, DialogTrigger, DialogDescription } from '../ui/dialog';
import { Button, ButtonProps } from '../ui/button';
import { ShareLinkFilters } from '@/types/shareLink';
import { generateShareLink } from '@/handlers/api/shareLink.handler';
import { Input } from '../ui/input';
import { Label } from '@radix-ui/react-label';


interface ShareAssetsTriggerProps {
  filters: ShareLinkFilters
  buttonProps?: ButtonProps
}

export default function ShareAssetsTrigger({ filters, buttonProps }: ShareAssetsTriggerProps) {
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    return generateShareLink(filters).then(({ link }) => {
      setGeneratedLink(link);
    }).catch((err) => {
      setErrorMessage(err.message);
    }).finally(() => {
      setLoading(false);
    });
  }

  const handleCopy = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button {...buttonProps}>Share</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Assets</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Share your assets with your friends and family.
        </DialogDescription>
        {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        {generatedLink ? <div className="flex flex-col gap-2">
          <Label className='text-sm'>Share Link</Label>
          <Input readOnly type="text" value={generatedLink} />
          <p className='text-xs text-muted-foreground'>
            This is a stateless link, it will not work if you leave the page. Which means it cannot be expired.
          </p>
          <Button onClick={handleCopy}>{copied ? 'Copied' : 'Copy'}</Button>
        </div> : (
          <Button onClick={handleGenerate} disabled={loading}>Generate Share Link</Button>
        )}
      </DialogContent>
    </Dialog>
  )
}
