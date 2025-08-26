import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Copy, MessageSquare, Maximize2, Minimize2, RefreshCw, Edit, Save, WandSparkles } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useFormContext } from "./form-context"
import { Textarea } from "@/components/ui/textarea"
import { rewriteSMS } from "@/lib/api-client"
import { useIsMobile } from "@/hooks/use-mobile"

interface SMSDisplayProps {
    sms: string
    isGenerating: boolean
    setIsGenerating: (value: boolean) => void
    setSMS: (sms: string) => void
}

export function SMSDisplay({ sms, isGenerating, setIsGenerating, setSMS }: SMSDisplayProps) {
    const { toast } = useToast()
    const { formData } = useFormContext()
    const isMobile = useIsMobile()
    const [isCopied, setIsCopied] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editedText, setEditedText] = useState(sms)
    const [selectedOption, setSelectedOption] = useState<"extend" | "shorten" | "regenerate" | null>(null)

    // Update editedText when sms changes
    useEffect(() => {
        setEditedText(sms)
    }, [sms])

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(sms)
            setIsCopied(true)
            toast({
                title: "Copied!",
                description: "SMS copied to clipboard",
                duration: 2000,
            })
            setTimeout(() => setIsCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy text: ", err)
            toast({
                title: "Copy failed",
                description: "Could not copy to clipboard",
                variant: "destructive",
                duration: 2000,
            })
        }
    }

    const handleToggleEdit = () => {
        if (isEditing) {
            // Save changes
            if (editedText !== sms) {
                setSMS(editedText)
                toast({
                    title: "Changes Saved",
                    description: "Your edits have been applied to the SMS",
                    duration: 2000,
                })
            }
        }
        setIsEditing(!isEditing)
    }

    const handleRewrite = async () => {
        if (!selectedOption) {
            toast({
                title: "Selection Required",
                description: "Please select either 'Extend' or 'Shorten' option",
                variant: "destructive",
            })
            return
        }

        setIsGenerating(true)

        try {
            const response = await rewriteSMS({
                text: isEditing ? editedText : sms,
                option: selectedOption,
                language: formData.language || "english",
            })

            if (response.status === "success" && response.output) {
                setSMS(response.output)
                toast({
                    title: "Success",
                    description: `SMS ${selectedOption === "extend" ? "extended" : "shortened"} successfully`,
                })
            } else {
                toast({
                    title: "Error",
                    description: response.message || "Failed to rewrite SMS. Please try again.",
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error("Error rewriting SMS:", error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to rewrite SMS. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <Card className="border-border border-2 h-full">
            <CardHeader>
                <CardTitle className="font-[family-name:var(--font-space-grotesk)]">Generated SMS</CardTitle>
                <CardDescription className="font-[family-name:var(--font-dm-sans)]">
                    Your AI-optimized message will appear here
                </CardDescription>
            </CardHeader>
            <CardContent>
                {sms ? (
                    <>
                        <div className="space-y-4">
                            <div className="relative mb-10">
                                {isEditing ? (
                                    <Textarea
                                        value={editedText}
                                        onChange={(e) => setEditedText(e.target.value)}
                                        className="min-h-[120px] text-sm p-4 focus:border-accent"
                                        placeholder="Edit your SMS message..."
                                    />
                                ) : (
                                    <div className="bg-muted/50 p-4 rounded-md text-sm whitespace-pre-wrap">
                                        {sms}
                                    </div>
                                )}
                                <div className="absolute bottom-0 right-0 translate-y-1/2 z-10 flex gap-2">
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        onClick={handleToggleEdit}
                                        className="h-8 w-8 rounded-full shadow-sm cursor-pointer"
                                        aria-label={isEditing ? "Save changes" : "Edit message"}
                                        title={isEditing ? "Save changes" : "Edit message"}
                                        type="button"
                                    >
                                        {isEditing ? <Save className="h-4 w-4 text-blue-500" /> : <Edit className="h-4 w-4" />}
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        onClick={handleCopy}
                                        className="h-8 w-8 rounded-full shadow-sm cursor-pointer"
                                        aria-label="Copy to clipboard"
                                        title="Copy to clipboard"
                                        type="button"
                                        disabled={isEditing}
                                    >
                                        {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Character count: {isEditing ? editedText.length : sms.length}/{formData.characterLimit}
                            </div>
                            <div className="space-y-4 mt-4">
                                <div className={`flex ${isMobile ? 'flex-col' : 'flex-wrap'} gap-2`}>
                                    <Button
                                        variant={selectedOption === "regenerate" ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSelectedOption("regenerate")}
                                        disabled={isGenerating}
                                        className={isMobile ? 'w-full' : 'flex-1'}
                                    >
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Regenerate
                                    </Button>
                                    <Button
                                        variant={selectedOption === "extend" ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSelectedOption("extend")}
                                        disabled={isGenerating}
                                        className={isMobile ? 'w-full' : 'flex-1'}
                                    >
                                        <Maximize2 className="h-4 w-4 mr-2" />
                                        Extend
                                    </Button>
                                    <Button
                                        variant={selectedOption === "shorten" ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSelectedOption("shorten")}
                                        disabled={isGenerating}
                                        className={isMobile ? 'w-full' : 'flex-1'}
                                    >
                                        <Minimize2 className="h-4 w-4 mr-2" />
                                        Shorten
                                    </Button>
                                </div>
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={handleRewrite}
                                    disabled={isGenerating || !selectedOption}
                                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                                >
                                    {isGenerating ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <WandSparkles className="h-4 w-4 mr-2" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-[200px] text-center">
                        <MessageSquare className="h-12 w-12 text-muted-foreground/30 mb-2" />
                        <p className="text-muted-foreground">
                            {isGenerating ? "Generating your SMS..." : "Fill out the form and generate to see your SMS"}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
