"use client"

import * as React from "react"
import { Moon, Sun, Monitor, Palette, Heart, Star } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme()

  const themes = [
    { id: "light", name: "فاتح", icon: Sun, description: "الوضع الفاتح" },
    { id: "dark", name: "داكن", icon: Moon, description: "الوضع الداكن" },
    { id: "system", name: "النظام", icon: Monitor, description: "حسب إعداد النظام" },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">تبديل المظهر</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[200px]">
        {themes.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption.id}
            onClick={() => setTheme(themeOption.id)}
            className={`flex items-center gap-3 cursor-pointer ${
              theme === themeOption.id ? 'bg-accent' : ''
            }`}
          >
            <themeOption.icon className="h-4 w-4" />
            <div className="flex flex-col">
              <span className="font-medium">{themeOption.name}</span>
              <span className="text-xs text-muted-foreground">{themeOption.description}</span>
            </div>
            {theme === themeOption.id && (
              <div className="ml-auto">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
              </div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
