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
import { ImageIcon, Trash } from "lucide-react"
import { ResizeBar } from "./resize-bar"

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

type ButtonType =
  | "small_square_button"
  | "small_rectangle_button"
  | "rectangle_button"
  | "rectangle_vertical_button"
  | "square_button"

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

    // === States for preview mode ===
    const [cardSize, setCardSize] = useState<CardSize>({
      width: "178px",
      height: "178px",
    })
    const [isHovered, setIsHovered] = useState(false)
    const [isHoveredImage, setIsHoveredImage] = useState(false)
    const [selectedButton, setSelectedButton] = useState<ButtonType>(
      "small_square_button"
    )

    // === Functions for edit mode ===
    //function to create a widget in a database
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

    // === Functions for preview mode ===
    //Function to delete a widget from the database
    const handleDeleteWidget = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      // Logic to perform the delete
      console.log("Logic to perform the delete")
    }

    // Function to resize an widget
    const handleResize = (
      e: React.MouseEvent<HTMLButtonElement>,
      width: string,
      height: string,
      buttonName: ButtonType
    ) => {
      e.preventDefault()
      setCardSize({ width, height })
      setSelectedButton(buttonName)
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
              className={`h-[${cardSize.height}] w-[${
                cardSize.width
              }] relative rounded-3xl p-6 shadow-sm 
                ${
                  selectedButton === "small_rectangle_button" &&
                  " flex flex-row p-4"
                }
                ${
                  selectedButton === "rectangle_button" &&
                  " grid grid-cols-2 gap-4"
                }
                `}
              {...props}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div
                className={`${
                  selectedButton === "small_rectangle_button" &&
                  " flex grow flex-row"
                }`}
              >
                <CardHeader
                  className={`mt-2 p-0 ${
                    selectedButton === "small_rectangle_button" && "ml-2"
                  }`}
                >
                  <CardDescription>
                    {iconUrl && (
                      <Image
                        src={iconUrl}
                        width={`${
                          selectedButton === "small_rectangle_button" ? 30 : 40
                        }`}
                        height={`${
                          selectedButton === "small_rectangle_button" ? 30 : 40
                        }`}
                        alt="Icono"
                      />
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent
                  className={`grow p-0 ${
                    selectedButton === "small_rectangle_button" && "ml-2"
                  }`}
                >
                  <Textarea
                  overrideClassName="min-h-8 mt-2 flex h-8 max-h-20 w-full resize-y items-center overflow-hidden rounded-md bg-white pt-2 text-sm font-semibold placeholder:font-normal placeholder:text-gray-400 hover:bg-gray-100 focus:outline-none"
                    value={title}
                    placeholder="Title..."
                    id="textArea"
                    onChange={handleTextAreaChange}
                    onClick={(e) => e.preventDefault()}
                  />
                </CardContent>
                <CardFooter
                  className={`p-0 ${
                    selectedButton === "small_rectangle_button" && "hidden"
                  }`}
                >
                  {basicUrl && (
                    <div className="text-xs text-gray-400">{basicUrl}</div>
                  )}
                </CardFooter>
                {isHovered && (
                  <>
                    <Button
                      className="absolute left-0 top-0 -translate-x-1/3 -translate-y-1/3 rounded-full p-2 shadow-2xl"
                      variant="outline"
                      size="icon"
                      id="deleteButton"
                      onClick={handleDeleteWidget}
                    >
                      <Trash strokeWidth={2} className="h-4 w-4" />
                    </Button>

                    <ResizeBar
                      selectedButton={selectedButton}
                      handleResize={handleResize}
                    />
                  </>
                )}
              </div>
              {selectedButton === "rectangle_button" && (
                <Card
                  className="relative hover:bg-slate-500"
                  onMouseEnter={() => setIsHoveredImage(true)}
                  onMouseLeave={() => setIsHoveredImage(false)}
                >
                  Image
                  {isHoveredImage && (
                    <div
                      id="resizableBar"
                      className="absolute left-0 top-0 -translate-x-1/3 -translate-y-1/3 rounded-lg p-2"
                    >
                      <Card className="h-[36px] w-[74px] bg-black">
                        <CardHeader className="space-y-0 p-0">
                          <CardContent className="flex items-center justify-center pt-0">
                            <Button
                              className={`border-0 bg-black text-white`}
                              variant="outline"
                              size="icon"
                              id="small_square_button"
                              onClick={(e) =>
                                handleResize(
                                  e,
                                  "178px",
                                  "178px",
                                  "small_square_button"
                                )
                              }
                            >
                              <ImageIcon
                                strokeWidth={2}
                                className="m-2 h-6 w-6"
                              />
                            </Button>
                            <Button
                              className={`border-0 bg-black text-white`}
                              variant="outline"
                              size="icon"
                              id="small_rectangle_button"
                              onClick={(e) =>
                                handleResize(
                                  e,
                                  "380px",
                                  "77px",
                                  "small_rectangle_button"
                                )
                              }
                            >
                              <Trash strokeWidth={2} className="m-2 h-6 w-6" />
                            </Button>
                          </CardContent>
                        </CardHeader>
                      </Card>
                    </div>
                  )}
                </Card>
              )}
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
