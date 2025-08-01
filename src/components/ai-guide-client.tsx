'use client'

import { useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { culturalEtiquetteQueryAction } from "@/app/(main)/ai-guide/actions"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Bot, User } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

const formSchema = z.object({
  query: z.string().min(10, {
    message: "Your question must be at least 10 characters.",
  }),
})

type FormValues = z.infer<typeof formSchema>

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export function AiGuideClient() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
    },
  })

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true)
    setMessages(prev => [...prev, { role: 'user', content: data.query }])
    form.reset()

    const result = await culturalEtiquetteQueryAction(data)
    
    if (result.success && result.answer) {
      setMessages(prev => [...prev, { role: 'ai', content: result.answer }])
    } else {
      setMessages(prev => [...prev, { role: 'ai', content: result.error || "Sorry, I couldn't process that request." }])
    }

    setIsLoading(false)
  }

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-8rem)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <Bot className="w-16 h-16 mb-4" />
            <h2 className="text-2xl font-semibold">AI Cultural Guide</h2>
            <p>Ask me anything about cultural, racial, or religious etiquette.</p>
          </div>
        )}
        {messages.map((message, index) => (
          <div key={index} className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
            {message.role === 'ai' && (
              <Avatar>
                <AvatarFallback><Bot /></AvatarFallback>
              </Avatar>
            )}
            <div className={`rounded-lg p-3 max-w-lg ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
             {message.role === 'user' && (
              <Avatar>
                <AvatarFallback><User /></AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
         {isLoading && (
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarFallback><Bot /></AvatarFallback>
              </Avatar>
              <div className="rounded-lg p-3 bg-muted w-full max-w-lg">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
        )}
      </div>
      <div className="p-4 border-t">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-4">
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Textarea
                      placeholder="e.g., What is the proper way to greet an elder in Japan?"
                      className="resize-none"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Thinking...' : 'Ask'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
