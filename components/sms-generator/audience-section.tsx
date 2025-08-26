import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users } from "lucide-react"
import { useFormContext } from "./form-context"
import { useIsMobile } from "@/hooks/use-mobile"

export function AudienceSection() {
    const { formData, updateFormData } = useFormContext()
    const isMobile = useIsMobile()
    const customInputClass = "border-2 focus-visible:ring-2"

    return (
        <AccordionItem value="audience" className="border-border">
            <AccordionTrigger className="hover:no-underline cursor-pointer">
                <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-accent" />
                    <span className="font-[family-name:var(--font-space-grotesk)]">Target Audience</span>
                    {(formData.demographics.ageRange || formData.customerSegment) && (
                        <Badge variant="secondary" className="ml-2 max-w-[100px] truncate">
                            Configured
                        </Badge>
                    )}
                </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
                <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
                    <div className="space-y-2">
                        <Label className="font-[family-name:var(--font-dm-sans)]">Age Range</Label>
                        <Select
                            value={formData.demographics.ageRange}
                            onValueChange={(value) => updateFormData("demographics.ageRange", value)}
                        >
                            <SelectTrigger className={`${customInputClass} cursor-pointer`}>
                                <SelectValue placeholder="Select age range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Ages</SelectItem>
                                <SelectItem value="18-24">18-24</SelectItem>
                                <SelectItem value="25-34">25-34</SelectItem>
                                <SelectItem value="35-44">35-44</SelectItem>
                                <SelectItem value="45-54">45-54</SelectItem>
                                <SelectItem value="55+">55+</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="font-[family-name:var(--font-dm-sans)]">Gender</Label>
                        <Select
                            value={formData.demographics.gender}
                            onValueChange={(value) => updateFormData("demographics.gender", value)}
                        >
                            <SelectTrigger className={`${customInputClass} cursor-pointer`}>
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="font-[family-name:var(--font-dm-sans)]">Customer Segment</Label>
                        <Select
                            value={formData.customerSegment}
                            onValueChange={(value) => updateFormData("customerSegment", value)}
                        >
                            <SelectTrigger className={`${customInputClass} cursor-pointer`}>
                                <SelectValue placeholder="Select segment" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Customers</SelectItem>
                                <SelectItem value="new">New Customers</SelectItem>
                                <SelectItem value="loyal">Loyal Customers</SelectItem>
                                <SelectItem value="inactive">Inactive Customers</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    )
}
