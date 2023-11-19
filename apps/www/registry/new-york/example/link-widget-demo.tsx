import { useEffect, useState } from "react"

import { LinkWidget } from "@/registry/new-york/ui/link-widget"

interface UrlInfo {
  completeUrl: string
  basicUrl: string
  iconUrl: string
  title: string
}

export default function LinkWidgetDemo() {
  const [dataWidget, setdataWidget] = useState<UrlInfo>()

  const createWidget = () => {
    console.log("data to create a widget in the database -> ", dataWidget)
  }
  useEffect(() => {
    if (dataWidget) createWidget()
  }, [dataWidget])

  return <LinkWidget payload={setdataWidget} />
}
