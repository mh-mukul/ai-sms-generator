import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe } from "lucide-react"
import { useFormContext } from "./form-context"
import { useIsMobile } from "@/hooks/use-mobile"

export function LanguageSection() {
    const { formData, updateFormData } = useFormContext()
    const isMobile = useIsMobile()
    const customInputClass = "border-2 focus-visible:ring-2"

    return (
        <AccordionItem value="localization" className="border-border">
            <AccordionTrigger className="hover:no-underline cursor-pointer">
                <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-accent" />
                    <span className="font-[family-name:var(--font-space-grotesk)]">Language & Localization</span>
                    {formData.language && (
                        <Badge variant="secondary" className="ml-2 max-w-[100px] truncate">
                            {formData.language}
                        </Badge>
                    )}
                </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
                <div className="space-y-2">
                    <Label className="font-[family-name:var(--font-dm-sans)]">Language</Label>
                    <Select value={formData.language} onValueChange={(value) => updateFormData("language", value)}>
                        <SelectTrigger className={`${customInputClass} cursor-pointer`}>
                            <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="bangla">Bangla</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="cultural" className="font-[family-name:var(--font-dm-sans)]">
                        Cultural References (Optional)
                    </Label>
                    <Input
                        id="cultural"
                        placeholder="e.g., festivals, events, local greetings..."
                        value={formData.culturalReferences}
                        onChange={(e) => updateFormData("culturalReferences", e.target.value)}
                        className={`w-full ${customInputClass}`}
                    />
                    <p className="text-xs text-muted-foreground">
                        Specify any local cultural references to include in your SMS
                    </p>
                </div>
            </AccordionContent>
        </AccordionItem>
    )
}
