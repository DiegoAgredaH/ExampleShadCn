import {
  RectangleHorizontalIcon,
  RectangleVerticalIcon,
  SquareIcon,
} from "lucide-react"

import { Button } from "./button"
import { Card, CardContent, CardHeader } from "./card"

type ButtonType =
  | "small_square_button"
  | "small_rectangle_button"
  | "rectangle_button"
  | "rectangle_vertical_button"
  | "square_button"
  
interface Props {
  selectedButton: string
  handleResize: (
    arg0: React.MouseEvent<HTMLButtonElement>,
    arg1: string,
    arg2: string,
    arg3: ButtonType
  ) => void
}

export const ResizeBar = ({ selectedButton, handleResize }: Props) => {
  return (
    <div id="resizableBar" className="absolute inset-x-0 bottom-0 flex translate-y-5 items-center justify-center">
      <Card className="h-[36px] w-[178px] bg-black">
        <CardHeader className="space-y-0 p-0">
          <CardContent className="flex items-center justify-center pt-1">
            <Button
              className={`h-7 w-7 border-0 bg-black text-white ${
                selectedButton === "small_square_button" &&
                "bg-accent text-accent-foreground"
              }`}
              variant="outline"
              size="icon"
              id="small_square_button"
              onClick={(e) =>
                handleResize(e, "178px", "178px", "small_square_button")
              }
            >
              <SquareIcon strokeWidth={6} className="h-2 w-2" />
            </Button>
            <Button
              className={`h-7 w-7 border-0 bg-black text-white ${
                selectedButton === "small_rectangle_button" &&
                "bg-accent text-accent-foreground"
              }`}
              variant="outline"
              size="icon"
              id="small_rectangle_button"
              onClick={(e) =>
                handleResize(e, "380px", "77px", "small_rectangle_button")
              }
            >
              <RectangleHorizontalIcon strokeWidth={4} className="h-3 w-3" />
            </Button>
            <Button
              className={`h-7 w-7 border-0 bg-black text-white ${
                selectedButton === "rectangle_button" &&
                "bg-accent text-accent-foreground"
              }`}
              variant="outline"
              size="icon"
              id="rectangle_button"
              onClick={(e) =>
                handleResize(e, "380px", "178px", "rectangle_button")
              }
            >
              <RectangleHorizontalIcon strokeWidth={3} className="h-4 w-4" />
            </Button>
            <Button
              className={`h-7 w-7 border-0 bg-black text-white ${
                selectedButton === "rectangle_vertical_button" &&
                "bg-accent text-accent-foreground"
              }`}
              variant="outline"
              size="icon"
              id="rectangle_vertical_button"
              onClick={(e) =>
                handleResize(e, "178px", "380px", "rectangle_vertical_button")
              }
            >
              <RectangleVerticalIcon strokeWidth={3} className="h-4 w-4" />
            </Button>
            <Button
              className={`h-7 w-7 border-0 bg-black text-white ${
                selectedButton === "square_button" &&
                "bg-accent text-accent-foreground"
              }`}
              variant="outline"
              size="icon"
              id="square_button"
              onClick={(e) =>
                handleResize(e, "380px", "380px", "square_button")
              }
            >
              <SquareIcon strokeWidth={3} className="h-4 w-4" />
            </Button>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  )
}
