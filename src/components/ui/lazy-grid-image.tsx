/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from 'react'
import { Image, ImageExtended, ThumbnailImageProps } from 'react-grid-gallery'

interface LazyImageProps extends ThumbnailImageProps<ImageExtended<Image>> {}

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
    <img {...props.imageProps} alt={props.imageProps.alt || ""} title="" />
  )
}
