import { Button } from '@/components/ui/button'
import { DropdownMenu,  DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { IAsset } from '@/types/asset';
import { DotsVerticalIcon, HamburgerMenuIcon } from '@radix-ui/react-icons';
import { Clock, PlusIcon } from 'lucide-react'
import React, { useState } from 'react'
import AssetOffsetDialog from './AssetOffsetDialog';

interface IProps {
  onAdd?: () => void;
  assets: IAsset[]; 
}
export default function AssetsOptions({ onAdd, assets }: IProps) {
  const [open, setOpen] = useState(false);
    
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className='cursor-pointer'>
            <HamburgerMenuIcon className="w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem className='flex items-center gap-2' onSelect={() => setOpen(true)}>
            <Clock className="w-4 h-4" /> Offset Asset Dates
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {open && <AssetOffsetDialog assets={assets} open={open} toggleOpen={setOpen} />}
    </>
  )
}
