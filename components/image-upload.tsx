"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Upload, X, Loader2 } from "lucide-react"

interface ImageUploadProps {
    onImagesAdd: (images: string[]) => void
    existingImages: string[]
    onRemoveImage: (index: number) => void
    max?: number
}

export function ImageUpload({ onImagesAdd, existingImages, onRemoveImage, max = 10 }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const totalImages = existingImages.length

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || [])
        if (selectedFiles.length === 0) return

        // Limit number of files to upload
        const spotsLeft = max - totalImages
        if (spotsLeft <= 0) {
            alert(`You can only upload a maximum of ${max} images.`)
            return
        }

        const files = selectedFiles.slice(0, spotsLeft)
        if (selectedFiles.length > spotsLeft) {
            alert(`Only ${spotsLeft} images were accepted to stay within the limit of ${max}.`)
        }

        setUploading(true)

        try {
            const formData = new FormData()
            files.forEach((file) => {
                formData.append("files", file)
            })

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                throw new Error("Upload failed")
            }

            const data = await response.json()
            // Important: We don't add to local previews if we're calling onImagesAdd 
            // and the parent immediately adds them to existingImages.
            // This prevents the "double preview" bug.
            onImagesAdd(data.urls)

            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        } catch (error) {
            console.error("Upload error:", error)
            alert("Failed to upload images. Please try again.")
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="space-y-3">
            {totalImages < max && (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-muted/50 transition text-center"
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple={max > 1}
                        accept="image/*"
                        onChange={handleFileSelect}
                        disabled={uploading}
                        className="hidden"
                    />
                    <div className="flex flex-col items-center gap-2">
                        {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
                        <div>
                            <p className="font-medium text-sm">{uploading ? "Uploading..." : max === 1 ? "Click to upload an image" : "Click to upload or drag and drop"}</p>
                            <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    </div>
                </div>
            )}

            {existingImages.length > 0 && (
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                        {existingImages.length} / {max} image(s) added
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {existingImages.map((image, index) => (
                            <div key={`existing-${index}`} className="relative group">
                                <img
                                    src={image || "/placeholder.svg"}
                                    alt={`Product ${index}`}
                                    className="w-full h-24 object-cover rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => onRemoveImage(index)}
                                    className="absolute top-1 right-1 bg-destructive text-white rounded p-1.5 sm:p-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition shadow-sm"
                                >
                                    <X className="w-4 h-4 sm:w-3 sm:h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
