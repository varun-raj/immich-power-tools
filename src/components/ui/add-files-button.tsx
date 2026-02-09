import React, { ChangeEvent, useRef } from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface AddFileButtonProps extends ButtonProps {
  multiple?: boolean
  supportedTypes: string[]
  onFilesSelected: (files: File[]) => void
}

export function AddFileButton({
  multiple = false,
  supportedTypes,
  onFilesSelected,
  children,
  ...buttonProps
}: AddFileButtonProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const selectedFiles = Array.from(e.target.files)
    const supportedFiles = selectedFiles.filter((file) =>
      supportedTypes.includes(file.type)
    )

    if (supportedFiles.length > 0) {
      onFilesSelected(supportedFiles)
    }

    e.target.value = ""
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        multiple={multiple}
        accept={supportedTypes.join(",")}
        onChange={handleFileInput}
      />

      <Button {...buttonProps} onClick={handleClick}>
        <Plus/>
      </Button>
    </>
  )
}
