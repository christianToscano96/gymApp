import * as React from "react"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@radix-ui/react-hover-card"

export function HoverCardUI({ trigger, children }: { trigger: React.ReactNode; children: React.ReactNode }) {
  return (
    <HoverCard openDelay={80} closeDelay={50}>
      <HoverCardTrigger asChild>{trigger}</HoverCardTrigger>
  <HoverCardContent className="bg-white p-4 rounded-xl shadow-[0_8px_32px_0_rgba(60,60,120,0.18),0_1.5px_6px_0_rgba(60,60,120,0.10)]">
        {children}
      </HoverCardContent>
    </HoverCard>
  )
}
