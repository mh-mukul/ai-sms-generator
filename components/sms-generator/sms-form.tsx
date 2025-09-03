"use client"

import { useState } from "react"
import { Accordion } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useFormContext } from "./form-context"
import { useToast } from "@/components/ui/use-toast"
import { ObjectiveSection } from "./objective-section"
import { AudienceSection } from "./audience-section"
import { ToneSection } from "./tone-section"
import { ConstraintsSection } from "./constraints-section"
import { OptimizationSection } from "./optimization-section"
import { generateSMS } from "@/lib/api-client"
import { useIsMobile } from "@/hooks/use-mobile"
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group"

interface SMSFormProps {
    onGenerateSuccess: (sms: string) => void
    isGenerating: boolean
    setIsGenerating: (value: boolean) => void
}

export function SMSForm({ onGenerateSuccess, isGenerating, setIsGenerating }: SMSFormProps) {
    const { toast } = useToast()
    const { formData, resetFormData, updateFormData } = useFormContext()
    const isMobile = useIsMobile()
    const customInputClass = "border-2 focus-visible:ring-2"

    const handleGenerate = async (event: React.FormEvent) => {
        event.preventDefault()
        setIsGenerating(true)

        try {
            const response = await generateSMS({
                original_sms: formData.originalSMS,
                language: formData.language,
                objective: formData.objective,
                age_range: formData.demographics.ageRange,
                gender: formData.demographics.gender,
                customer_segment: formData.customerSegment,
                personalization: formData.personalization,
                char_limit: formData.characterLimit,
                additional_context: formData.additionalContext
            })

            console.log("API response:", response);

            if (response.status === "success" && response.output) {
                onGenerateSuccess(response.output)
            } else {
                toast({
                    title: "Error",
                    description: response.message || "Failed to generate SMS. Please try again.",
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error("Error generating SMS:", error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to generate SMS. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <Card className="border-border border-2 h-full">
            <CardHeader className="pb-4 relative">
                <div className={`flex ${isMobile ? 'flex-col' : 'items-center justify-between'}`}>
                    <div>
                        <CardTitle className="font-[family-name:var(--font-space-grotesk)]">Campaign Parameters</CardTitle>
                        <CardDescription className="font-[family-name:var(--font-dm-sans)]">
                            Configure your SMS campaign settings for optimal results
                        </CardDescription>
                    </div>
                    <div className={isMobile ? 'mt-4' : ''}>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={resetFormData}
                            className="font-[family-name:var(--font-dm-sans)] cursor-pointer"
                        >
                            Reset
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {/* Original SMS */}
                <div className="space-y-2">
                    <Label className="font-[family-name:var(--font-dm-sans)]">Write your SMS *</Label>
                    <Textarea
                        placeholder="Write your sms..."
                        value={formData.originalSMS}
                        onChange={(e) => updateFormData("originalSMS", e.target.value)}
                        className={`min-h-[80px] ${customInputClass}`}
                        required
                    />
                </div>
                <div>
                    <Label className="font-[family-name:var(--font-dm-sans)] mt-2">Language *</Label>
                    <ToggleGroup
                        type="single"
                        value={formData.language}
                        onValueChange={(value) => updateFormData("language", value)}
                        className={`w-full ${customInputClass} mt-2`}
                    >
                        <ToggleGroupItem value="english" className="cursor-pointer">
                            English
                        </ToggleGroupItem>
                        <ToggleGroupItem value="bangla" className="cursor-pointer">
                            Bangla
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>

                <Separator className="my-6" />

                <Accordion type="multiple" defaultValue={["objective", "audience"]} className="space-y-2">
                    <ObjectiveSection />
                    <AudienceSection />
                    <ConstraintsSection />
                </Accordion>

                <Separator className="my-6" />

                {/* Additional Context */}
                <div className="space-y-2">
                    <Label className="font-[family-name:var(--font-dm-sans)]">Additional Context (Optional)</Label>
                    <Textarea
                        placeholder="Add any specific requirements, brand guidelines, or context for your SMS campaign..."
                        value={formData.additionalContext}
                        onChange={(e) => updateFormData("additionalContext", e.target.value)}
                        className={`min-h-[80px] ${customInputClass}`}
                    />
                </div>

                {/* Form Actions */}
                <form onSubmit={handleGenerate}>
                    <Button
                        type="submit"
                        disabled={isGenerating || !formData.objective}
                        className="w-full mt-6 bg-accent hover:bg-accent/90 text-accent-foreground font-[family-name:var(--font-dm-sans)] cursor-pointer"
                        size="lg"
                    >
                        {isGenerating ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                Generating SMS...
                            </>
                        ) : (
                            <>
                                <Sparkle className="h-4 w-4 mr-2" />
                                Generate SMS
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
