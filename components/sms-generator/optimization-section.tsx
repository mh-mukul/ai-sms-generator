import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Zap } from "lucide-react"
import { useFormContext } from "./form-context"

export function OptimizationSection() {
    const { formData, updateFormData } = useFormContext()
    const customInputClass = "border-2 focus-visible:ring-2"

    return (
        <AccordionItem value="optimization" className="border-border">
            <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-accent" />
                    <span className="font-[family-name:var(--font-space-grotesk)]">Optimization Goals</span>
                    {formData.optimizationGoal && (
                        <Badge variant="secondary" className="ml-2">
                            {formData.optimizationGoal}
                        </Badge>
                    )}
                </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
                <div className="space-y-2">
                    <Label className="font-[family-name:var(--font-dm-sans)]">Primary Goal</Label>
                    <Select
                        value={formData.optimizationGoal}
                        onValueChange={(value) => updateFormData("optimizationGoal", value)}
                    >
                        <SelectTrigger className={customInputClass}>
                            <SelectValue placeholder="Select optimization goal" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ctr">Higher Click-Through Rate</SelectItem>
                            <SelectItem value="conversion">Higher Conversion (Sales/Registrations)</SelectItem>
                            <SelectItem value="engagement">More Engagement (Replies/Participation)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </AccordionContent>
        </AccordionItem>
    )
}
