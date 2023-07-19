"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ImagePlus, Trash } from "lucide-react"
import { CldUploadWidget } from "next-cloudinary"

import { Button } from "./button"

interface ImageUploadProps {
  disabled: boolean
  onChange: (value: string) => void
  onRemove: (value: string) => void
  value: string[]
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState<boolean>(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])
  if (!isMounted) return null

  const onUpload = (result: any) => {
    onChange(result.info.secure_url)
  }

  return (
    <>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
            key={url}
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                variant="destructive"
                onClick={() => onRemove(url)}
                size="icon"
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
            <Image src={url} alt="Image" className="object-cover" fill />
          </div>
        ))}
      </div>
      <CldUploadWidget onUpload={onUpload} uploadPreset="vbqtqybr">
        {({ open }) => {
          const onClick = () => {
            open()
          }
          return (
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={onClick}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload an Image
            </Button>
          )
        }}
      </CldUploadWidget>
    </>
  )
}

export default ImageUpload
