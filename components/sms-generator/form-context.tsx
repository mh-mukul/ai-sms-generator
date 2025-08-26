"use client"

import { createContext, useState, useContext, ReactNode } from "react"

export interface FormData {
    objective: string
    demographics: {
        ageRange: string
        gender: string
    }
    customerSegment: string
    tone: string
    characterLimit: number
    personalization: string
    includeEmojis: boolean
    optimizationGoal: string
    language: string
    culturalReferences: string
    additionalContext: string
}

const initialFormData: FormData = {
    objective: "",
    demographics: { ageRange: "", gender: "" },
    customerSegment: "",
    tone: "",
    characterLimit: 160,
    personalization: "",
    includeEmojis: false,
    optimizationGoal: "",
    language: "",
    culturalReferences: "",
    additionalContext: "",
}

interface FormContextType {
    formData: FormData
    updateFormData: (field: string, value: any) => void
    resetFormData: () => void
}

const FormContext = createContext<FormContextType | undefined>(undefined)

export function FormProvider({ children }: { children: ReactNode }) {
    const [formData, setFormData] = useState<FormData>(initialFormData)

    const updateFormData = (field: string, value: any) => {
        if (field.includes(".")) {
            const [parent, child] = field.split(".")
            setFormData((prev) => {
                const parentObj = prev[parent as keyof FormData];
                if (typeof parentObj === 'object' && parentObj !== null) {
                    return {
                        ...prev,
                        [parent]: { ...parentObj, [child]: value },
                    };
                }
                return prev;
            })
        } else {
            setFormData((prev) => ({ ...prev, [field]: value }))
        }
    }

    const resetFormData = () => {
        setFormData(initialFormData)
    }

    return (
        <FormContext.Provider value={{ formData, updateFormData, resetFormData }}>
            {children}
        </FormContext.Provider>
    )
}

export function useFormContext() {
    const context = useContext(FormContext)
    if (context === undefined) {
        throw new Error("useFormContext must be used within a FormProvider")
    }
    return context
}
