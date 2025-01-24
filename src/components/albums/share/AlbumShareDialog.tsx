import { AlertDialog } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTitle, DialogHeader, DialogContent } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { shareAlbums } from '@/handlers/api/album.handler';
import { generateShareLink } from '@/handlers/api/shareLink.handler';
import { IAlbum } from '@/types/album';
import React, { ForwardedRef, forwardRef, useImperativeHandle, useState } from 'react'
import ShareAssetsTrigger from '@/components/shared/ShareAssetsTrigger';

export interface IAlbumShareDialogProps {

}

export interface IAlbumShareDialogRef {
  open: (selectedAlbums: IAlbum[]) => void;
  close: () => void;
}

interface IAlbumWithLink extends IAlbum {
  shareLink?: string;
  allowDownload?: boolean;
  allowUpload?: boolean;
  showMetadata?: boolean;
}

const AlbumShareDialog = forwardRef(({ }: IAlbumShareDialogProps, ref: ForwardedRef<IAlbumShareDialogRef>) => {
  const [open, setOpen] = useState(false);
  const [selectedAlbums, setSelectedAlbums] = useState<IAlbumWithLink[]>([]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generated, setGenerated] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateShareLink = async () => {
    setGenerating(true);
    const data = selectedAlbums.map((album) => ({
      albumId: album.id,
      albumName: album.albumName,
      assetCount: album.assetCount,
      allowDownload: !!album.allowDownload,
      allowUpload: !!album.allowUpload,
      showMetadata: !!album.showMetadata,
    }));

    return shareAlbums(data).then((updatedAlbums) => {
      setSelectedAlbums(updatedAlbums);
      setGenerated(true);
    })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setGenerating(false);
      });
  }

  const handleGenerateGlobalShareLink = async () => {
    setLoading(true);
    return generateShareLink({
      albumIds: selectedAlbums.map((album) => album.id),
    }).then(({ link }) => {
      setGeneratedLink(link);
    }).catch((err) => {
      setErrorMessage(err.message);
    }).finally(() => {
      setLoading(false);
    });
  }
  const handleAllowPropertyChange = (albumId: string, property: string, checked: boolean) => {
    setSelectedAlbums((prevAlbums) => prevAlbums.map((album) => album.id === albumId ? { ...album, [property]: checked } : album));
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


  useImperativeHandle(ref, () => ({
    open: (selectedAlbums: IAlbum[]) => {
      setSelectedAlbums(selectedAlbums.map((album) => ({ ...album, allowDownload: true, allowUpload: true, showMetadata: true })));
      setOpen(true);
    },
    close: () => {
      setOpen(false);
    }
  }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Share {selectedAlbums.length} albums</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {error && <div className="text-red-500">{error}</div>}
          <ol className="flex flex-col gap-4 list-decimal px-4 py-4">
            {selectedAlbums.map((album) => (
              <li key={album.id}>
                <div className="flex justify-between gap-1">
                  <h3 className="text-sm font-medium">{album.albumName}</h3>
                  <p className="text-xs border truncate rounded-md px-1 py-0.5 text-muted-foreground">{album.assetCount} Items</p>
                </div>
                <div className="flex flex-col gap-2">
                  {album.shareLink ?
                    <p className="text-xs text-muted-foreground truncate font-mono overflow-x-auto">{album.shareLink}</p> : (
                      <>
                        <p className="text-xs text-muted-foreground">No share link generated</p>
                        <div className="flex gap-2">
                          <div className="flex items-center gap-1">
                            <Checkbox checked={album.allowDownload} onCheckedChange={(checked) => handleAllowPropertyChange(album.id, 'allowDownload', !!checked)} />
                            <Label className="text-xs">Allow Download</Label>
                          </div>
                          <div className="flex items-center gap-1">
                            <Checkbox checked={album.allowUpload} onCheckedChange={(checked) => handleAllowPropertyChange(album.id, 'allowUpload', !!checked)} />
                            <Label className="text-xs">Allow Upload</Label>
                          </div>
                          <div className="flex items-center gap-1">
                            <Checkbox checked={album.showMetadata} onCheckedChange={(checked) => handleAllowPropertyChange(album.id, 'showMetadata', !!checked)} />
                            <Label className="text-xs">Show Metadata</Label>
                          </div>

                        </div>
                      </>
                    )}
                </div>
              </li>

            ))}
          </ol>
          {generatedLink && (
            <div className="flex flex-col gap-2 items-center">
              <p className="text-sm py-2 text-muted-foreground text-center">Share links all generated</p>
              <div className="flex gap-2 w-full">
                <Input value={generatedLink} readOnly />
                <Button onClick={handleCopy} className='max-w-fit'>
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </div>

          )}
          {generated ? (
            <>
              <p className="text-sm py-2 text-muted-foreground text-center">Share links all generated</p>
            </>
          ) : (
            <>
              {generating ? <div className="flex justify-center gap-2">
                <p className="text-sm py-2 text-muted-foreground">Generating share links...</p>
              </div> : (
                <div className="flex justify-center gap-2">
                  <AlertDialog
                    title="Generate Share Links"
                    description="Generate share links for the selected albums."
                    onConfirm={handleGenerateShareLink}
                  >
                    <Button disabled={generating}>
                      Generate For {selectedAlbums.length} albums
                    </Button>
                  </AlertDialog>
                  <ShareAssetsTrigger filters={{ albumIds: selectedAlbums.map((album) => album.id) }} />
                </div>
              )}
            </>
          )}

        </div>
      </DialogContent>
    </Dialog>
  )
})

AlbumShareDialog.displayName = "AlbumShareDialog";

export default AlbumShareDialog;
