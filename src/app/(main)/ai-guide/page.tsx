import { AiGuideClient } from "@/components/ai-guide-client"
import { Card } from "@/components/ui/card"

export default function AiGuidePage() {
  return (
    <div className="h-full">
      <Card className="h-full">
        <AiGuideClient />
      </Card>
    </div>
  )
}
