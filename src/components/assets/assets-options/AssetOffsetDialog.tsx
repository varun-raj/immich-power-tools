import React, { useEffect, useState } from 'react'
import { IAsset } from '@/types/asset';
import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatDate, offsetDate } from '@/helpers/date.helper';
import Image from 'next/image';
import { updateAssets } from '@/handlers/api/asset.handler';
import { useToast } from '@/components/ui/use-toast';

interface IProps {
  assets: IAsset[];
  onComplete: () => void;
}

export default function AssetOffsetDialog({ assets: _assets, onComplete }: IProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState<IAsset[]>(_assets);
  const [offsetData, setOffsetData] = useState<{ days: number, hours: number, minutes: number, seconds: number, years: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    years: 0
  });
  const [loading, setLoading] = useState(false);
  const [assetStatus, setAssetStatus] = useState<Record<string, string>>({});

  const handleChange = (key: keyof typeof offsetData, value: number) => {
    setOffsetData({ ...offsetData, [key]: value });
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const promises = assets.map(async (asset) => {
      setAssetStatus({ [asset.id]: 'pending' });
      await updateAssets({
        ids: [asset.id],
        dateTimeOriginal: offsetDate(asset.dateTimeOriginal, offsetData)
      })
        .then(() => {
          setLoading(false);
          setOpen(false);
        })
        .catch((error) => {
          setLoading(false);
          setAssetStatus({ [asset.id]: 'error' });
        })
    });
    await Promise.all(promises);
    setLoading(false);
    setOpen(false);
    onComplete();
    toast({
      title: 'Asset dates offset',
      description: 'Asset dates have been offset',
    })
  }


  useEffect(() => {
    setAssets(_assets);
  }, [_assets]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"default"} size={"sm"} onClick={() => setOpen(true)} disabled={assets.length === 0}>
          Offset Dates
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-[800px]'>
        <DialogHeader>
          <DialogTitle>Offset Asset Dates</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='flex items-end gap-2'>
          <div>
            <Label>Years</Label>
            <Input type="number" value={offsetData.years} onChange={(e) => handleChange("years", parseInt(e.target.value))} />
          </div>
          <div>
            <Label>Days</Label>
            <Input type="number" value={offsetData.days} onChange={(e) => handleChange("days", parseInt(e.target.value))} />
          </div>
          <div>
            <Label>Hours</Label>
            <Input type="number" value={offsetData.hours} onChange={(e) => handleChange("hours", parseInt(e.target.value))} />
          </div>
          <div>
            <Label>Minutes</Label>
            <Input type="number" value={offsetData.minutes} onChange={(e) => handleChange("minutes", parseInt(e.target.value))} />
          </div>
          <div>
            <Label>Seconds</Label>
            <Input type="number" value={offsetData.seconds} onChange={(e) => handleChange("seconds", parseInt(e.target.value))} />
          </div>
          <Button disabled={loading} type="submit">Offset Dates</Button>
        </form>
        <div className='grid grid-cols-3 gap-4 py-2 overflow-y-auto max-h-[500px]'>
          {assets.map((asset) => (
            <div key={asset.id} >
              <div className='relative w-full h-full rounded-md border overflow-hidden' >
                {assetStatus[asset.id] === 'pending' ? <div className='absolute text-xs text-center bottom-0 left-0 right-0 bg-blue-500/50 text-white p-2'>
                  <p className='text-white'>Offsetting...</p>
                </div> : (
                  <div className='absolute text-xs text-center bottom-0 left-0 right-0 bg-green-500/50 text-white p-2'>{formatDate(offsetDate(asset.dateTimeOriginal, offsetData), 'PPpp')} </div>
                )}
                <Image
                  src={asset.previewUrl}
                  alt={asset.originalFileName}
                  width={300}
                  height={300}
                  objectPosition='cover'
                  style={{
                    objectFit: 'cover',
                    overflow: 'hidden',
                    height: '100%',
                    width: '100%'
                  }}
                />
                <div className='absolute text-xs text-center top-0 left-0 right-0 bg-red-500/50 text-white p-2'>{formatDate(asset.dateTimeOriginal, 'PPpp')}</div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
