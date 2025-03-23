"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Upload, X, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/tflite"
import { Input } from "../ui/input"

interface ImageUploaderProps {
  onFilesSelected?: (files: File[]) => void
  maxFiles?: number
  className?: string
}

export function ImageUploader({ onFilesSelected, maxFiles = 1, className }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      if (!isDragging) {
        setIsDragging(true)
      }
    },
    [isDragging],
  )

  const processFiles = useCallback(
    (newFiles: File[]) => {
      // Filter for image files only
      const imageFiles = Array.from(newFiles).filter((file) => file.type.startsWith("image/"))

      if (imageFiles.length === 0) return

      // Limit to maxFiles
      const filesToAdd = imageFiles.slice(0, maxFiles - files.length)
      if (filesToAdd.length === 0) return

      // Create object URLs for previews
      const newPreviews = filesToAdd.map((file) => URL.createObjectURL(file))

      setFiles((prev) => [...prev, ...filesToAdd])
      setPreviews((prev) => [...prev, ...newPreviews])

      if (onFilesSelected) {
        onFilesSelected([...files, ...filesToAdd])
      }
    },
    [files, maxFiles, onFilesSelected],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFiles(Array.from(e.dataTransfer.files))
      }
    },
    [processFiles],
  )

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(Array.from(e.target.files))
      }
    },
    [processFiles],
  )

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const removeFile = useCallback(
    (index: number) => {
      setFiles((prev) => prev.filter((_, i) => i !== index))

      // Revoke the object URL to avoid memory leaks
      URL.revokeObjectURL(previews[index])
      setPreviews((prev) => prev.filter((_, i) => i !== index))

      if (onFilesSelected) {
        onFilesSelected(files.filter((_, i) => i !== index))
      }
    },
    [files, previews, onFilesSelected],
  )

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "relative flex flex-col items-center justify-center w-full h-64 p-6 border-2 border-dashed rounded-lg transition-colors",
          "bg-background hover:bg-muted/50",
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          className,
        )}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Input
          ref={fileInputRef}
          type="file"
          multiple={maxFiles > 1}
          accept="image/*"
          className="hidden"
          onChange={handleFileInputChange}
        />

        {previews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full h-full overflow-auto p-2">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview || "/placeholder.svg"}
                  alt={`Preview ${index}`}
                  className="w-full h-full object-cover rounded-md"
                />
                <Button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="p-4 rounded-full bg-primary/10">
              <Upload className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Drag & drop your images here</h3>
              <p className="text-sm text-muted-foreground">or click to browse your files</p>
            </div>
            <Button type="button" variant="outline" onClick={handleButtonClick} className="mt-2">
              <ImageIcon className="mr-2 h-4 w-4" />
              Select Images
            </Button>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <p className="mt-2 text-sm text-muted-foreground">
          {files.length} {files.length === 1 ? "file" : "files"} selected
        </p>
      )}
    </div>
  )
}

