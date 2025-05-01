"use client"

import type { Dispatch, SetStateAction } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { ModelSettings } from "@/lib/types"
import { getModelDisplayName } from "@/lib/utils"

interface ChatSettingsProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  settings: ModelSettings
  setSettings: Dispatch<SetStateAction<ModelSettings>>
}

export function ChatSettings({ isOpen, setIsOpen, settings, setSettings }: ChatSettingsProps) {
  const handleModelChange = (value: string) => {
    setSettings((prev) => ({ ...prev, model: value }))
  }

  const handleTemperatureChange = (value: number[]) => {
    setSettings((prev) => ({ ...prev, temperature: value[0] }))
  }

  const handleMaxTokensChange = (value: number[]) => {
    setSettings((prev) => ({ ...prev, maxTokens: value[0] }))
  }

  const handleWebSearchChange = (checked: boolean) => {
    setSettings((prev) => ({ ...prev, webSearch: checked }))
  }

  const handleDeepThinkingChange = (checked: boolean) => {
    setSettings((prev) => ({ ...prev, deepThinking: checked }))
  }

  const handleSaveChatsChange = (checked: boolean) => {
    setSettings((prev) => ({ ...prev, saveChats: checked }))
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-[90vw] max-w-md sm:max-w-md">
        <SheetHeader className="mb-5">
          <SheetTitle className="text-right">إعدادات المحادثة</SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">النموذج</h3>
            <Select value={settings.model} onValueChange={handleModelChange}>
              <SelectTrigger>
                <SelectValue placeholder="اختر النموذج" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-3.5-turbo">{getModelDisplayName("gpt-3.5-turbo")}</SelectItem>
                <SelectItem value="gpt-4">{getModelDisplayName("gpt-4")}</SelectItem>
                <SelectItem value="gpt-4o">{getModelDisplayName("gpt-4o")}</SelectItem>
                <SelectItem value="claude-3-opus-20240229">{getModelDisplayName("claude-3-opus-20240229")}</SelectItem>
                <SelectItem value="claude-3-sonnet-20240229">
                  {getModelDisplayName("claude-3-sonnet-20240229")}
                </SelectItem>
                <SelectItem value="claude-3-haiku-20240307">
                  {getModelDisplayName("claude-3-haiku-20240307")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">معلمات النموذج</h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="temperature">درجة الحرارة</Label>
                <span className="text-sm text-muted-foreground">{settings.temperature}</span>
              </div>
              <Slider
                id="temperature"
                min={0}
                max={2}
                step={0.1}
                value={[settings.temperature]}
                onValueChange={handleTemperatureChange}
              />
              <p className="text-xs text-muted-foreground">
                تتحكم في مدى إبداعية النموذج. القيم المنخفضة تنتج إجابات أكثر تحديدًا، والقيم العالية تنتج إجابات أكثر
                إبداعًا.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="max-tokens">الحد الأقصى للرموز</Label>
                <span className="text-sm text-muted-foreground">{settings.maxTokens}</span>
              </div>
              <Slider
                id="max-tokens"
                min={100}
                max={4000}
                step={100}
                value={[settings.maxTokens]}
                onValueChange={handleMaxTokensChange}
              />
              <p className="text-xs text-muted-foreground">الحد الأقصى لعدد الرموز التي سيتم إنشاؤها في الاستجابة.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">الميزات المتقدمة</h3>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="web-search" className="flex-1">
                البحث في الويب
              </Label>
              <Switch id="web-search" checked={settings.webSearch} onCheckedChange={handleWebSearchChange} />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="deep-thinking" className="flex-1">
                التفكير العميق
              </Label>
              <Switch id="deep-thinking" checked={settings.deepThinking} onCheckedChange={handleDeepThinkingChange} />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="save-chats" className="flex-1">
                حفظ المحادثات
              </Label>
              <Switch id="save-chats" checked={settings.saveChats} onCheckedChange={handleSaveChatsChange} />
            </div>
          </div>

          <div className="pt-4">
            <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
              <X className="ml-2 h-4 w-4" />
              إغلاق
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
