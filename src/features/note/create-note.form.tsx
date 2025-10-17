import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/shared/ui/kit/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/kit/form'
import { Input } from '@/shared/ui/kit/input'
import { DefaultService } from '@/shared/api/generated'
import { useState } from 'react'
import { toast } from '@/shared/ui/kit/toast'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
})

export function CreateNoteForm({
  onNoteCreated,
}: {
  onNoteCreated: () => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      await DefaultService.todosControllerCreate({
        title: values.title,
      })
      form.reset()
      onNoteCreated()
      toast.success('Note created successfully')
    } catch (error) {
      console.error(error)
      toast.error('Failed to create note')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Note title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Note'}
        </Button>
      </form>
    </Form>
  )
}
