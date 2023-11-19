/* eslint-disable tailwindcss/classnames-order */
import React, { useEffect, useState } from "react"
import Image from "next/image"

import { Icons } from "@/components/icons"

import { Button } from "./button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "./card"
import { Input } from "./input"
import { Textarea } from "./textarea"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  overrideClassName?: string
}

interface UrlInfo {
  completeUrl: string
  basicUrl: string
  iconUrl: string
  title: string
}

interface CardSize {
  width: string
  height: string
}

const LinkWidget = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, children, ...props }, ref) => {
    // === States for edit mode ===
    const [basicUrl, setBasicUrl] = useState<string>("")
    const [completeUrl, setCompleteUrl] = useState<string>("")
    const [createPayload, setCreatePayload] = useState<UrlInfo>()
    const [data, setData] = useState(null)
    const [inputValue, setInputValue] = useState<string>("")
    const [iconUrl, setIconUrl] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [title, setTitle] = useState<string>("")

    // === Functions for edit mode ===
    const createWidget = () => {
      console.log("createPayload", createPayload)
    }

    const fetchData = async (url: string) => {
      try {
        const urlEncoded = encodeURIComponent(url)
        const apiKey = "c8995860-93cb-421e-8fe9-0b35fe0e2459"
        const requestUrl = `https://opengraph.io/api/1.1/site/${urlEncoded}?accept_lang=auto&use_superior=true&app_id=${apiKey}`
        setLoading(true)
        fetch(requestUrl)
          .then((res) => res.json())
          .then((data) => {
            setData(data)
            getBasicUrl(data.htmlInferred.url)
            setIconUrl(data.htmlInferred.favicon)
            setTitle(data.htmlInferred.site_name)
            setCompleteUrl(data.htmlInferred.url)
            setLoading(false)
          })
      } catch (error) {
        console.error(error)
      }
    }

    const getBasicUrl = (url: string) => {
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = `https://${url} `
      }
      const urlObject = new URL(url)
      const updatedHostname = urlObject.hostname.replace(/^www\./, "")
      setBasicUrl(updatedHostname)
    }

    const handleAddClick = async () => {
      if (isValidURL(inputValue)) {
        fetchData(inputValue)
      }
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value)
    }

    const handlePasteClick = async () => {
      try {
        const clipboardText = await navigator.clipboard.readText()
        setInputValue(clipboardText)
      } catch (error) {
        console.error("Error reading the clipboard: ", error)
      }
    }

    const isValidURL = (url: string) => {
      const urlPattern =
        /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$|^www\.[^\s/$.?#].[^\s]*$|^[a-zA-Z]\.[a-zA-Z\d]*[a-zA-Z]$/

      return urlPattern.test(url)
    }

    // === Functions for view mode ===
    const handleTextAreaChange = (
      event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
      setTitle(event.target.value)
    }

    useEffect(() => {
      if (data) {
        const payload = {
          completeUrl,
          basicUrl,
          iconUrl,
          title,
        }
        setCreatePayload(payload)
      }
    }, [data])

    useEffect(() => {
      createWidget()
    }, [createPayload])

    return (
      <>
        {loading ? (
          <div className="flex items-center text-sm text-muted-foreground">
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </div>
        ) : data ? (
          <a href={completeUrl} target="_blank" rel="noopener noreferrer">
            <Card
              className={`h-[178px] w-[178px] relative rounded-3xl p-6 shadow-sm `}
              {...props}
            >
              <div className={``}>
                <CardHeader className={`mt-2 p-0 `}>
                  <CardDescription>
                    {iconUrl && (
                      <Image src={iconUrl} width={40} height={40} alt="Icono" />
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className={`grow p-0`}>
                  <Textarea
                    overrideClassName="min-h-8 mt-2 flex h-8 max-h-20 w-full resize-y items-center overflow-hidden rounded-md bg-white pt-2 text-sm font-semibold placeholder:font-normal placeholder:text-gray-400 hover:bg-gray-100 focus:outline-none"
                    value={title}
                    placeholder="Title..."
                    id="textArea"
                    onChange={handleTextAreaChange}
                    onClick={(e) => e.preventDefault()}
                  />
                </CardContent>
                <CardFooter className={`p-0`}>
                  {basicUrl && (
                    <div className="text-xs text-gray-400">{basicUrl}</div>
                  )}
                </CardFooter>
              </div>
            </Card>
          </a>
        ) : (
          <div className="flex h-10 items-center rounded-lg border p-2 text-sm shadow-md focus-visible:outline-none">
            <Input
              overrideClassName="mr-2 w-full rounded-lg focus:outline-none"
              onChange={handleInputChange}
              placeholder="Enter Link"
              type="widget"
              value={inputValue}
              ref={ref}
              {...props}
            />
            {inputValue ? (
              <Button
                size="widget"
                className="bg-green-400 font-bold text-white hover:bg-green-500"
                onClick={handleAddClick}
              >
                Add
              </Button>
            ) : (
              <Button size="widget" onClick={handlePasteClick}>
                Paste
              </Button>
            )}
          </div>
        )}
      </>
    )
  }
)
LinkWidget.displayName = "LinkWidget"

export { LinkWidget }
