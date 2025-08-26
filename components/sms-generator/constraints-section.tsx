import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings } from "lucide-react"
import { useFormContext } from "./form-context"
import { useIsMobile } from "@/hooks/use-mobile"

export function ConstraintsSection() {
    const { formData, updateFormData } = useFormContext()
    const isMobile = useIsMobile()
    const customInputClass = "border-2 focus-visible:ring-2"

    return (
        <AccordionItem value="constraints" className="border-border">
            <AccordionTrigger className="hover:no-underline cursor-pointer">
                <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-accent" />
                    <span className="font-[family-name:var(--font-space-grotesk)]">Message Constraints</span>
                    <Badge variant="secondary" className="ml-2 max-w-[100px] truncate">
                        {formData.characterLimit} chars
                    </Badge>
                </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
                <div className="space-y-2">
                    <Label className="font-[family-name:var(--font-dm-sans)]">Character Limit</Label>
                    <Input
                        type="number"
                        value={formData.characterLimit}
                        onChange={(e) => updateFormData("characterLimit", Number.parseInt(e.target.value))}
                        min={50}
                        max={320}
                        className={`w-full ${customInputClass}`}
                    />
                    <p className="text-xs text-muted-foreground">Standard SMS: 160 characters</p>
                </div>
                <div className="space-y-2">
                    <Label className="font-[family-name:var(--font-dm-sans)]">Personalization Fields</Label>
                    <Input
                        placeholder="e.g. [name], [discount], [expiry_date]"
                        type="text"
                        value={formData.personalization}
                        onChange={(e) => updateFormData("personalization", e.target.value)}
                        className={`${customInputClass}`}
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="emojis"
                        checked={formData.includeEmojis}
                        onCheckedChange={(checked) => updateFormData("includeEmojis", checked)}
                        className="cursor-pointer"
                    />
                    <Label htmlFor="emojis" className="font-[family-name:var(--font-dm-sans)]">
                        Include emojis
                    </Label>
                </div>
            </AccordionContent>
        </AccordionItem>
    )
}
