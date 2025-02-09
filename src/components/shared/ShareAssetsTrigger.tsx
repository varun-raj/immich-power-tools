import React, { useState } from 'react'
import { ShareLinkFilters } from '@/types/shareLink';
import { generateShareLink } from '@/handlers/api/shareLink.handler';


import { ButtonProps, Input, Switch, Button, Modal, Select } from 'antd';

interface ShareAssetsTriggerProps {
  filters: ShareLinkFilters
  buttonProps?: ButtonProps
}

export default function ShareAssetsTrigger({ filters, buttonProps }: ShareAssetsTriggerProps) {
  const [open, setOpen] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [config, setConfig] = useState<Partial<ShareLinkFilters>>({
    expiresIn: "never"
  });

  const handleReset = () => {
    setConfig({ expiresIn: "never" });
    setGeneratedLink(null);
  }

  const handleGenerate = async () => {
    setLoading(true);
    setErrorMessage(null);
    return generateShareLink({ ...filters, ...config }).then(({ link }) => {
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
    <>
    <Button {...buttonProps} onClick={() => setOpen(true)}>Share</Button>
    <Modal 
      title="Share Assets" 
      open={open} onCancel={() => setOpen(false)}
      footer={null}
      >
      <div>
        <p className='text-sm text-muted-foreground'>Generate a share link for the selected assets (either bunch of albums or bunch of people) and share it with your friends and family.</p>
        
        <div className='py-2 mt-2'>
        {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        {generatedLink ? <div className="flex flex-col gap-2">
          <p className='text-sm'>Share Link</p>
          <Input readOnly type="text" value={generatedLink} />
          <p className='text-xs text-muted-foreground'>
            This is a stateless link, it will not work if you leave the page. Which means it cannot be expired.
          </p>
          <div className="flex gap-2">
            <Button className="w-full" onClick={handleCopy}>{copied ? 'Copied' : 'Copy'}</Button>
            <Button className="w-full" type="dashed" onClick={handleReset}>Generate New Link</Button>
          </div>
        </div> : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-1">
              <div className="flex flex-col gap-1">
                <p className="text-sm m-0">Show People</p>
                <p className="text-xs text-muted-foreground m-0">
                  Show the list of people in the shared photos
                </p>
              </div>
              <Switch 
                checked={config.p} 
                onChange={(checked) => setConfig({ ...config, p: !!checked })} 
              />
            </div>
            <div className="flex items-center justify-between gap-1">
              <div className="flex flex-col gap-1">
                <p className="text-sm m-0">Link Expires In</p>
                <p className="text-xs text-muted-foreground m-0">
                  Should the link expire after the selected time
                </p>
              </div>
              
              <Select 
                placeholder="Select duration"
                options={[
                  { label: '1 Hour', value: '1h' },
                  { label: '1 Day (24 Hours)', value: '1d' },
                  { label: '7 Days', value: '7d' },
                  { label: '30 Days', value: '30d' },
                  { label: '90 Days', value: '90d' },
                  { label: 'Never Expires', value: 'never' },
                ]}
                onChange={(value) => setConfig({ ...config, expiresIn: value })}
              />
            </div>
            <Button onClick={handleGenerate} disabled={loading}>Generate Share Link</Button>
          </div>
        )}
        </div>
      </div>
    </Modal>
    </>
  )
}
