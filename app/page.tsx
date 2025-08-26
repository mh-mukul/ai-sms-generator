"use client"

import { useState } from "react"
import { GeneratorHeader } from "@/components/sms-generator/generator-header"
import { SMSForm } from "@/components/sms-generator/sms-form"
import { SMSDisplay } from "@/components/sms-generator/sms-display"
import { FormProvider } from "@/components/sms-generator/form-context"

export default function AISMSGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedSMS, setGeneratedSMS] = useState("")

  // Handler for when SMS generation is successful
  const handleGenerateSuccess = (sms: string) => {
    setGeneratedSMS(sms)
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="space-y-6">
        {/* Header */}
        <GeneratorHeader />

        {/* Form Context Provider wraps the entire form */}
        <FormProvider>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Form Section */}
            <div className="w-full lg:w-2/3">
              <SMSForm
                onGenerateSuccess={handleGenerateSuccess}
                isGenerating={isGenerating}
                setIsGenerating={setIsGenerating}
              />
            </div>

            {/* SMS Display Section */}
            <div className="w-full lg:w-1/3">
              <SMSDisplay
                sms={generatedSMS}
                isGenerating={isGenerating}
                setIsGenerating={setIsGenerating}
                setSMS={setGeneratedSMS}
              />
            </div>
          </div>
        </FormProvider>
      </div>
    </div>
  )
}
