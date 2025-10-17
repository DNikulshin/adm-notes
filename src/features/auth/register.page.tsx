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
import { AuthService, UsersService } from '@/shared/api/generated'
import { useSession } from '@/shared/model/session'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/model/routes'

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
})

function RegisterPage() {
  const login = useSession((state) => state.login)
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Register the user
      await UsersService.usersControllerRegister(values)
      // Login the user after registration
      const token = await AuthService.authControllerLogin(values)
      login(token)
      navigate('/')
    } catch (error: any) {
      console.error(error)
      // Handle error appropriately in UI
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <p className="mt-4">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="text-blue-500 hover:underline">
          Login
        </Link>
      </p>
    </div>
  )
}

export const Component = RegisterPage
