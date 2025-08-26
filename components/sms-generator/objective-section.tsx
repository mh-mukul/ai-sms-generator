import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Target } from "lucide-react"
import { useFormContext } from "./form-context"
import { useIsMobile } from "@/hooks/use-mobile"

export function ObjectiveSection() {
    const { formData, updateFormData } = useFormContext()
    const isMobile = useIsMobile()

    const objectives = [
        { value: "announcement", label: "Announcement" },
        { value: "promotional", label: "Promotional/Offer" },
        { value: "reminder", label: "Reminder" },
        { value: "engagement", label: "Engagement" },
        { value: "transactional", label: "Transactional" },
    ]

    return (
        <AccordionItem value="objective" className="border-border">
            <AccordionTrigger className="hover:no-underline cursor-pointer">
                <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-accent" />
                    <span className="font-[family-name:var(--font-space-grotesk)]">Campaign Objective</span>
                    {formData.objective && (
                        <Badge variant="secondary" className="ml-2 max-w-[100px] truncate">
                            {formData.objective}
                        </Badge>
                    )}
                </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
                <div className="space-y-2">
                    <Label className="font-[family-name:var(--font-dm-sans)]">What's your campaign goal?</Label>
                    <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
                        {objectives.map((option) => (
                            <Button
                                key={option.value}
                                variant={formData.objective === option.value ? "default" : "outline"}
                                onClick={() => updateFormData("objective", option.value)}
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
