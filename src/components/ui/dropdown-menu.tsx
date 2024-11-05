
import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";


export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Content
    ref={ref}
    className={`min-w-[8rem] bg-white rounded-md shadow-md p-1 ${className}`}
    {...props}
  />
));
DropdownMenuContent.displayName = "DropdownMenuContent";

export const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={`flex items-center px-2 py-1 text-sm cursor-pointer hover:bg-gray-200 ${className}`}
    {...props}
  />
));
DropdownMenuItem.displayName = "DropdownMenuItem";
