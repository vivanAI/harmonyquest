'use server'

import { culturalEtiquetteQuery, type CulturalEtiquetteInput } from "@/ai/flows/cultural-etiquette-query"

export async function culturalEtiquetteQueryAction(
  input: CulturalEtiquetteInput
): Promise<{ success: boolean; answer?: string; error?: string }> {
  try {
    const result = await culturalEtiquetteQuery(input)
    return { success: true, answer: result.answer }
  } catch (error) {
    console.error("Error in culturalEtiquetteQueryAction:", error)
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    }
  }
}
