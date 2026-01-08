"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Save, Plus, X } from "lucide-react"
import Link from "next/link"
import { ImageUpload } from "@/components/image-upload"
import { Switch } from "@/components/ui/switch"
import { RichTextEditor } from "@/components/rich-text-editor"

export default function EditTourPage() {
    const router = useRouter()
    const params = useParams()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        tagline: "",
        description: "",
        duration: "",
        category: "culture",
        price: "",
        originalPrice: "",
        isFrom: false,
        images: [] as string[],
        highlights: [] as string[],
        included: [] as string[],
        excluded: [] as string[],
        itineraryGlance: [] as string[],
        itineraryDetail: "",
        additionalInfo: "",
        optional: [] as string[],
        mapUrl: "",
        pricingTiers: [] as { groupSize: string, winterPrice: string, summerPrice: string }[],
        featured: false,
        active: true,
        whatToBring: [] as string[],
        difficulty: [] as string[],
        bestTime: [] as string[],
    })

    const [currentImage, setCurrentImage] = useState("")
    const [currentHighlight, setCurrentHighlight] = useState("")
    const [currentIncluded, setCurrentIncluded] = useState("")
    const [currentExcluded, setCurrentExcluded] = useState("")
    const [currentItineraryItem, setCurrentItineraryItem] = useState("")
    const [currentOptional, setCurrentOptional] = useState("")
    const [currentToBring, setCurrentToBring] = useState("")
    const [currentDifficulty, setCurrentDifficulty] = useState("")
    const [currentBestTime, setCurrentBestTime] = useState("")

    // Pricing Tier State
    const [currentPricingTier, setCurrentPricingTier] = useState({
        groupSize: "",
        winterPrice: "",
        summerPrice: ""
    })

    useEffect(() => {
        fetchTour()
    }, [])

    const fetchTour = async () => {
        try {
            const response = await fetch(`/api/admin/tours/${params.id}`, {
                credentials: "include"
            })

            if (response.ok) {
                const data = await response.json()
                setFormData({
                    ...data,
                    duration: String(data.duration),
                    price: String(data.price),
                })
            }
        } catch (error) {
            console.error("Failed to fetch:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const response = await fetch(`/api/admin/tours/${params.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    ...formData,
                    duration: parseInt(formData.duration),
                    price: parseFloat(formData.price),
                    originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
                    isFrom: !!formData.isFrom,
                    whatToBring: formData.whatToBring,
                    difficulty: formData.difficulty,
                    bestTime: formData.bestTime,
                }),
            })

            if (response.ok) {
                router.push("/dashboard/tours")
            } else {
                alert("Failed to update tour")
            }
        } catch (error) {
            console.error("Error:", error)
            alert("Failed to update tour")
        } finally {
            setSaving(false)
        }
    }

    const addToArray = (field: keyof typeof formData, value: string, setter: (val: string) => void) => {
        if (value.trim()) {
            setFormData({
                ...formData,
                [field]: [...(formData[field] as string[]), value.trim()],
            })
            setter("")
        }
    }

    const removeFromArray = (field: keyof typeof formData, index: number) => {
        setFormData({
            ...formData,
            [field]: (formData[field] as string[]).filter((_, i) => i !== index),
        })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-gray-500">Loading...</div>
            </div>
        )
    }

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/dashboard/tours">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Edit Tour</h1>
                    <p className="text-sm text-muted-foreground mt-1">Update tour package details</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-foreground">Basic Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Tour Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="bg-background border-input"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">URL Slug *</Label>
                            <Input
                                id="slug"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                required
                                className="bg-background border-input"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tagline">Tagline</Label>
                        <Input
                            id="tagline"
                            value={formData.tagline || ""}
                            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                            className="bg-background border-input"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={5}
                            required
                            className="bg-background border-input"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="duration">Duration (days) *</Label>
                            <Input
                                id="duration"
                                type="number"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                min="1"
                                required
                                className="bg-background border-input"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Categories (comma-separated) *</Label>
                            <Input
                                id="category"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                placeholder="e.g., Culture, Adventure, Desert"
                                required
                                className="bg-background border-input"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price">Price (USD) *</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                min="0"
                                required
                                className="bg-background border-input"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="originalPrice">Original Price (optional)</Label>
                            <Input
                                id="originalPrice"
                                type="number"
                                step="0.01"
                                value={formData.originalPrice}
                                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                                min="0"
                                className="bg-background border-input"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm">Show as &quot;From&quot; price</Label>
                            <div className="pt-2">
                                <Switch
                                    checked={formData.isFrom}
                                    onCheckedChange={(checked) => setFormData({ ...formData, isFrom: checked })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-foreground">Seasonal Pricing</h2>
                    <p className="text-sm text-muted-foreground">Manage pricing tiers for different group sizes and seasons.</p>

                    {/* Existing Tiers Table */}
                    {formData.pricingTiers && formData.pricingTiers.length > 0 && (
                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="p-3 text-left font-medium">Group Size</th>
                                        <th className="p-3 text-left font-medium">Winter Price</th>
                                        <th className="p-3 text-left font-medium">Summer Price</th>
                                        <th className="p-3 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {formData.pricingTiers.map((tier, idx) => (
                                        <tr key={idx} className="bg-card">
                                            <td className="p-3">{tier.groupSize}</td>
                                            <td className="p-3">{tier.winterPrice}</td>
                                            <td className="p-3">{tier.summerPrice}</td>
                                            <td className="p-3 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newTiers = [...formData.pricingTiers]
                                                        newTiers.splice(idx, 1)
                                                        setFormData({ ...formData, pricingTiers: newTiers })
                                                    }}
                                                    className="text-muted-foreground hover:text-destructive"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Add New Tier */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-muted/30 p-4 rounded-lg border border-dashed border-border">
                        <Input
                            placeholder="Group Size (e.g. 1 person)"
                            value={currentPricingTier.groupSize}
                            onChange={(e) => setCurrentPricingTier({ ...currentPricingTier, groupSize: e.target.value })}
                            className="bg-background"
                        />
                        <Input
                            placeholder="Winter Price (e.g. 295€)"
                            value={currentPricingTier.winterPrice}
                            onChange={(e) => setCurrentPricingTier({ ...currentPricingTier, winterPrice: e.target.value })}
                            className="bg-background"
                        />
                        <Input
                            placeholder="Summer Price (e.g. 270€)"
                            value={currentPricingTier.summerPrice}
                            onChange={(e) => setCurrentPricingTier({ ...currentPricingTier, summerPrice: e.target.value })}
                            className="bg-background"
                        />
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                if (currentPricingTier.groupSize && currentPricingTier.winterPrice && currentPricingTier.summerPrice) {
                                    setFormData({
                                        ...formData,
                                        pricingTiers: [...(formData.pricingTiers || []), currentPricingTier]
                                    })
                                    setCurrentPricingTier({ groupSize: "", winterPrice: "", summerPrice: "" })
                                }
                            }}
                            disabled={!currentPricingTier.groupSize || !currentPricingTier.winterPrice || !currentPricingTier.summerPrice}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Tier
                        </Button>
                    </div>
                </div>

                {/* Images */}
                <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-foreground">Tour Image</h2>
                    <ImageUpload
                        existingImages={formData.images}
                        onImagesAdd={(urls) => setFormData(prev => ({ ...prev, images: [...prev.images, ...urls] }))}
                        onRemoveImage={(idx) => removeFromArray("images", idx)}
                        max={1}
                    />
                </div>

                {/* Highlights, Included, Excluded */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                        <h3 className="font-semibold text-foreground">Highlights</h3>
                        <div className="flex gap-2">
                            <Input
                                value={currentHighlight}
                                onChange={(e) => setCurrentHighlight(e.target.value)}
                                placeholder="Add highlight"
                                className="text-sm bg-background border-input"
                            />
                            <Button
                                type="button"
                                onClick={() => addToArray("highlights", currentHighlight, setCurrentHighlight)}
                                size="icon"
                                variant="outline"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        {formData.highlights.length > 0 && (
                            <div className="space-y-2">
                                {formData.highlights.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 p-2 bg-muted/50 rounded text-sm">
                                        <span className="flex-1 text-foreground">{item}</span>
                                        <button type="button" onClick={() => removeFromArray("highlights", idx)}>
                                            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                        <h3 className="font-semibold text-foreground">Included</h3>
                        <div className="flex gap-2">
                            <Input
                                value={currentIncluded}
                                onChange={(e) => setCurrentIncluded(e.target.value)}
                                placeholder="What's included"
                                className="text-sm bg-background border-input"
                            />
                            <Button
                                type="button"
                                onClick={() => addToArray("included", currentIncluded, setCurrentIncluded)}
                                size="icon"
                                variant="outline"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        {formData.included.length > 0 && (
                            <div className="space-y-2">
                                {formData.included.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 p-2 bg-muted/50 rounded text-sm">
                                        <span className="flex-1 text-foreground">{item}</span>
                                        <button type="button" onClick={() => removeFromArray("included", idx)}>
                                            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                        <h3 className="font-semibold text-foreground">Excluded</h3>
                        <div className="flex gap-2">
                            <Input
                                value={currentExcluded}
                                onChange={(e) => setCurrentExcluded(e.target.value)}
                                placeholder="Not included"
                                className="text-sm bg-background border-input"
                            />
                            <Button
                                type="button"
                                onClick={() => addToArray("excluded", currentExcluded, setCurrentExcluded)}
                                size="icon"
                                variant="outline"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        {formData.excluded.length > 0 && (
                            <div className="space-y-2">
                                {formData.excluded.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 p-2 bg-muted/50 rounded text-sm">
                                        <span className="flex-1 text-foreground">{item}</span>
                                        <button type="button" onClick={() => removeFromArray("excluded", idx)}>
                                            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Itinerary Glance & Optional */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                        <h3 className="font-semibold text-foreground">Itinerary Glance</h3>
                        <div className="flex gap-2">
                            <Input
                                value={currentItineraryItem}
                                onChange={(e) => setCurrentItineraryItem(e.target.value)}
                                placeholder="e.g., Day 1: Arrival in Marrakech"
                                className="text-sm bg-background border-input"
                            />
                            <Button
                                type="button"
                                onClick={() => addToArray("itineraryGlance", currentItineraryItem, setCurrentItineraryItem)}
                                size="icon"
                                variant="outline"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        {formData.itineraryGlance.length > 0 && (
                            <div className="space-y-2">
                                {formData.itineraryGlance.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 p-2 bg-muted/50 rounded text-sm">
                                        <span className="flex-1 text-foreground">{item}</span>
                                        <button type="button" onClick={() => removeFromArray("itineraryGlance", idx)}>
                                            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                        <h3 className="font-semibold text-foreground">Optional Activities</h3>
                        <div className="flex gap-2">
                            <Input
                                value={currentOptional}
                                onChange={(e) => setCurrentOptional(e.target.value)}
                                placeholder="Add optional activity"
                                className="text-sm bg-background border-input"
                            />
                            <Button
                                type="button"
                                onClick={() => addToArray("optional", currentOptional, setCurrentOptional)}
                                size="icon"
                                variant="outline"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        {formData.optional.length > 0 && (
                            <div className="space-y-2">
                                {formData.optional.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 p-2 bg-muted/50 rounded text-sm">
                                        <span className="flex-1 text-foreground">{item}</span>
                                        <button type="button" onClick={() => removeFromArray("optional", idx)}>
                                            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* What to Bring */}
                <div className="bg-card border border-border rounded-lg p-3 sm:p-6 space-y-4">
                    <h3 className="font-semibold text-foreground">What to Bring</h3>
                    <div className="flex gap-2">
                        <Input
                            value={currentToBring}
                            onChange={(e) => setCurrentToBring(e.target.value)}
                            placeholder="Add item (e.g. Hiking boots)"
                            className="text-sm bg-background border-input"
                        />
                        <Button
                            type="button"
                            onClick={() => addToArray("whatToBring", currentToBring, setCurrentToBring)}
                            size="icon"
                            variant="outline"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    {formData.whatToBring.length > 0 && (
                        <div className="space-y-2">
                            {formData.whatToBring.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 p-2 bg-muted/50 rounded text-sm">
                                    <span className="flex-1 text-foreground">{item}</span>
                                    <button type="button" onClick={() => removeFromArray("whatToBring", idx)}>
                                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Difficulty & Fitness */}
                <div className="bg-card border border-border rounded-lg p-3 sm:p-6 space-y-4">
                    <h3 className="font-semibold text-foreground">Difficulty & Fitness</h3>
                    <div className="flex gap-2">
                        <Input
                            value={currentDifficulty}
                            onChange={(e) => setCurrentDifficulty(e.target.value)}
                            placeholder="Add point (e.g. Moderate fitness required)"
                            className="text-sm bg-background border-input"
                        />
                        <Button
                            type="button"
                            onClick={() => addToArray("difficulty", currentDifficulty, setCurrentDifficulty)}
                            size="icon"
                            variant="outline"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    {formData.difficulty.length > 0 && (
                        <div className="space-y-2">
                            {formData.difficulty.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 p-2 bg-muted/50 rounded text-sm">
                                    <span className="flex-1 text-foreground">{item}</span>
                                    <button type="button" onClick={() => removeFromArray("difficulty", idx)}>
                                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Best Time to Climb */}
                <div className="bg-card border border-border rounded-lg p-3 sm:p-6 space-y-4">
                    <h3 className="font-semibold text-foreground">Best Time to Climb</h3>
                    <div className="flex gap-2">
                        <Input
                            value={currentBestTime}
                            onChange={(e) => setCurrentBestTime(e.target.value)}
                            placeholder="Add point (e.g. May to September)"
                            className="text-sm bg-background border-input"
                        />
                        <Button
                            type="button"
                            onClick={() => addToArray("bestTime", currentBestTime, setCurrentBestTime)}
                            size="icon"
                            variant="outline"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    {formData.bestTime.length > 0 && (
                        <div className="space-y-2">
                            {formData.bestTime.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 p-2 bg-muted/50 rounded text-sm">
                                    <span className="flex-1 text-foreground">{item}</span>
                                    <button type="button" onClick={() => removeFromArray("bestTime", idx)}>
                                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Map Image */}
                <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-foreground">Map Image</h2>
                    <ImageUpload
                        existingImages={formData.mapUrl ? [formData.mapUrl] : []}
                        onImagesAdd={(urls) => setFormData(prev => ({ ...prev, mapUrl: urls[0] }))}
                        onRemoveImage={() => setFormData(prev => ({ ...prev, mapUrl: "" }))}
                        max={1}
                    />
                </div>

                {/* Rich Text Fields */}
                <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                    <div className="space-y-2">
                        <Label>Detailed Itinerary (Rich Text)</Label>
                        <RichTextEditor
                            value={formData.itineraryDetail}
                            onChange={(val) => setFormData({ ...formData, itineraryDetail: val })}
                            placeholder="Describe the day-by-day plan in detail..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Additional Information (e.g., Important Notes)</Label>
                        <RichTextEditor
                            value={formData.additionalInfo || ""}
                            onChange={(val) => setFormData({ ...formData, additionalInfo: val })}
                            placeholder="Add any other relevant details or travel advice..."
                        />
                    </div>
                </div>

                {/* Settings */}
                <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-foreground">Settings</h2>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-background">
                            <div className="space-y-0.5">
                                <Label className="text-base">Featured Tour</Label>
                                <p className="text-sm text-muted-foreground">
                                    Display this circuit on the homepage
                                </p>
                            </div>
                            <Switch
                                checked={formData.featured}
                                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-background">
                            <div className="space-y-0.5">
                                <Label className="text-base">Active Status</Label>
                                <p className="text-sm text-muted-foreground">
                                    Visible to the public
                                </p>
                            </div>
                            <Switch
                                checked={formData.active}
                                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                            />
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                    <Button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Save className="mr-2 h-4 w-4" />
                        {saving ? "Saving..." : "Update Tour"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    )
}
