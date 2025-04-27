/* eslint-disable @next/next/no-img-element */
import { humanizeDuration } from '@/helpers/string.helper'
import { PlayIcon } from '@radix-ui/react-icons'
import React, { useEffect } from 'react'
import { Image, ImageExtended, ThumbnailImageProps } from 'react-grid-gallery'

interface LazyImageProps extends ThumbnailImageProps<ImageExtended<Image & { isVideo?: boolean, duration?: string }>> {}


export default function LazyGridImage(
  props: LazyImageProps
) {
  const [isVisible, setIsVisible] = React.useState(false)
  const imageRef = React.useRef<HTMLImageElement>(null)

  const setupObserver = () => {
    const observer = new IntersectionObserver((entries) => {
      
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      })
    })

    if (imageRef.current)  {
      observer.observe(imageRef.current)
    }
    return observer
  }

  useEffect(() => {
    const observer = setupObserver()
    return () => {
      observer?.disconnect()
    }
  }, [])

  if (!isVisible) return (
    <div style={{ height: props.height }} ref={imageRef}  />
  )

  return (
    <div className="relative">
      <img {...props.imageProps} alt={props.imageProps.alt || ""} title="" />
      {props.item.isVideo && <div className="absolute bottom-2 right-2 bg-black/50 p-1 rounded-full flex items-center gap-1">
        <PlayIcon className="w-3 h-3 text-white" />
        {!!props.item.duration && <span className="text-xs text-white">{humanizeDuration(props.item.duration)}</span>}
      </div>}
    </div>
  )
}
