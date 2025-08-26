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
import { LanguageSection } from "./language-section"

interface SMSFormProps {
    onGenerateSuccess: (sms: string) => void
    isGenerating: boolean
    setIsGenerating: (value: boolean) => void
}

export function SMSForm({ onGenerateSuccess, isGenerating, setIsGenerating }: SMSFormProps) {
    const { toast } = useToast()
    const { formData, resetFormData, updateFormData } = useFormContext()
    const customInputClass = "border-2 focus-visible:ring-2"

    const handleGenerate = async (event: React.FormEvent) => {
        event.preventDefault()
        setIsGenerating(true)

        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    objective: formData.objective,
                    age_range: formData.demographics.ageRange,
                    gender: formData.demographics.gender,
                    customer_segment: formData.customerSegment,
                    tone: formData.tone,
                    personalization: formData.personalization,
                    char_limit: formData.characterLimit,
                    allow_emojis: formData.includeEmojis,
                    goal: formData.optimizationGoal,
                    language: formData.language,
                    cultural_reference: formData.culturalReferences,
                    additional_context: formData.additionalContext
                }),
            })

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`API responded with status ${response.status}:`, errorText);
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json()
            console.log("API response:", data);

            if (data.status === "success" && data.output) {
                onGenerateSuccess(data.output)
            } else {
                toast({
                    title: "Error",
                    description: data.message || "Failed to generate SMS. Please try again.",
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
            <CardHeader className="pb-4">
                <CardTitle className="font-[family-name:var(--font-space-grotesk)]">Campaign Parameters</CardTitle>
                <CardDescription className="font-[family-name:var(--font-dm-sans)]">
                    Configure your SMS campaign settings for optimal results
                </CardDescription>
                {/* Reset Button */}
                <div className="absolute top-4 right-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={resetFormData}
                    >
                        Reset
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Accordion type="multiple" defaultValue={["objective", "audience"]} className="space-y-2">
                    <ObjectiveSection />
                    <AudienceSection />
                    <ToneSection />
                    <ConstraintsSection />
                    <OptimizationSection />
                    <LanguageSection />
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

                {/* Generate Button */}
                <form onSubmit={handleGenerate}>
                    <Button
                        type="submit"
                        disabled={isGenerating || !formData.objective}
                        className="w-full mt-6 bg-accent hover:bg-accent/90 text-accent-foreground font-[family-name:var(--font-dm-sans)]"
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
