"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, FileType, ImageIcon } from "lucide-react"
import { motion } from "framer-motion"

interface FileUploaderProps {
  onFileUpload: (file: File) => void
}

export function FileUploader({ onFileUpload }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragError, setDragError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
    setDragError(null)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    setDragError(null)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      if (isValidFileType(file)) {
        onFileUpload(file)
      } else {
        setDragError("Invalid file type. Please upload PNG, JPG, or PDF files only.")
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (isValidFileType(file)) {
        onFileUpload(file)
      } else {
        setDragError("Invalid file type. Please upload PNG, JPG, or PDF files only.")
      }
    }
  }

  const isValidFileType = (file: File) => {
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"]
    return validTypes.includes(file.type)
  }

  return (
    <motion.div
      className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${
        isDragging
          ? "border-primary bg-primary/10"
          : dragError
            ? "border-destructive bg-destructive/5"
            : "border-border hover:border-primary/50 hover:bg-background/80"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col items-center justify-center space-y-6">
        <motion.div
          className={`p-6 rounded-full ${
            dragError ? "bg-destructive/10" : isDragging ? "bg-primary/20" : "bg-primary/10"
          }`}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {dragError ? (
            <FileType className="h-12 w-12 text-destructive" />
          ) : (
            <ImageIcon className="h-12 w-12 text-primary" />
          )}
        </motion.div>
        <div>
          <motion.h3
            className="text-xl font-medium mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            Upload UML or Architecture Diagram
          </motion.h3>
          {dragError ? (
            <motion.p
              className="text-sm text-destructive mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              {dragError}
            </motion.p>
          ) : (
            <>
              <motion.p
                className="text-sm text-muted-foreground mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                Drag and drop your diagram file, or click to browse
              </motion.p>
              <motion.p
                className="text-xs text-muted-foreground mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                Supports PNG, JPG, and PDF formats
              </motion.p>
            </>
          )}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 border-primary/30 hover:border-primary hover:bg-primary/10"
            size="lg"
          >
            <Upload className="h-4 w-4 mr-2" />
            Select Diagram
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".png,.jpg,.jpeg,.pdf"
            className="hidden"
          />
        </motion.div>
      </div>
    </motion.div>
  )
}
