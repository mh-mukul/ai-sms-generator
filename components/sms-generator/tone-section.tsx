import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Palette } from "lucide-react"
import { useFormContext } from "./form-context"
import { useIsMobile } from "@/hooks/use-mobile"

export function ToneSection() {
    const { formData, updateFormData } = useFormContext()
    const isMobile = useIsMobile()

    const toneOptions = [
        { value: "professional", label: "Professional/Formal" },
        { value: "friendly", label: "Friendly & Conversational" },
        { value: "urgent", label: "Urgent (FOMO, Limited Time)" },
        { value: "exciting", label: "Exciting/Energetic" },
        { value: "caring", label: "Caring/Empathetic" },
    ]

    return (
        <AccordionItem value="tone" className="border-border">
            <AccordionTrigger className="hover:no-underline cursor-pointer">
                <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-accent" />
                    <span className="font-[family-name:var(--font-space-grotesk)]">Tone & Style</span>
                    {formData.tone && (
                        <Badge variant="secondary" className="ml-2 max-w-[100px] truncate">
                            {formData.tone}
                        </Badge>
                    )}
                </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
                <div className="space-y-2">
                    <Label className="font-[family-name:var(--font-dm-sans)]">Communication Style</Label>
                    <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
                        {toneOptions.map((option) => (
                            <Button
                                key={option.value}
                                variant={formData.tone === option.value ? "default" : "outline"}
                                onClick={() => updateFormData("tone", option.value)}
                                className="justify-start h-auto py-3 px-4 text-left cursor-pointer"
                            >
                                {option.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    )
}
