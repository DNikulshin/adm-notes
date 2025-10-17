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
import { AuthService } from '@/shared/api/generated'
import { useSession } from '@/shared/model/session'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/model/routes'
import { useState } from 'react'

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

function LoginPage() {
  const login = useSession((state) => state.login)
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setError(null)
      const response = await AuthService.authControllerLogin(values)

      // Extract token from response - might be in different formats
      let token: string
      if (typeof response === 'string') {
        token = response
      } else if (
        response &&
        typeof response === 'object' &&
        'access_token' in response
      ) {
        token = response.access_token
      } else if (
        response &&
        typeof response === 'object' &&
        'token' in response
      ) {
        token = response.token
      } else if (
        response &&
        typeof response === 'object' &&
        'accessToken' in response
      ) {
        token = response.accessToken
      } else {
        // Try to convert to string as a fallback
        token = String(response)
      }

      // Validate that we have a proper token before proceeding
      if (!token || token === '[object Object]') {
        throw new Error('Invalid token received from server')
      }

      login(token)
      navigate('/')
    } catch (error: any) {
      console.error('Login error:', error)
      if (error.message?.includes('ERR_CONNECTION_REFUSED')) {
        setError(
          'Cannot connect to the server. Please make sure the backend API is running.'
        )
      } else if (error.status === 401) {
        setError('Invalid email or password.')
      } else {
        setError(
          error.message || 'An unexpected error occurred. Please try again.'
        )
      }
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
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <p className="mt-4">
        Don't have an account?{' '}
        <Link to={ROUTES.REGISTER} className="text-blue-500 hover:underline">
          Register
        </Link>
      </p>
    </div>
  )
}

export const Component = LoginPage
