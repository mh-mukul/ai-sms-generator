import { MessageSquare } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

export function GeneratorHeader() {
    const isMobile = useIsMobile()

    return (
        <div className="text-left space-y-2">
            <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-8 w-8 text-accent" />
                <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold font-[family-name:var(--font-space-grotesk)] text-foreground`}>
                    AI SMS Generator
                </h1>
            </div>
            <p className="text-muted-foreground font-[family-name:var(--font-dm-sans)]">
                Create targeted SMS campaigns with AI-powered optimization
            </p>
        </div>
    )
}
