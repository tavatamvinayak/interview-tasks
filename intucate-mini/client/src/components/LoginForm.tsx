'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { mockLogin } from '@/lib/utils';

const schema = z.object({
  email: z.string().email().endsWith('@intucate.com', { message: 'Must be @intucate.com' }),
  password: z.string().min(8),
});

type FormData = z.infer<typeof schema>;

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const router = useRouter();

  const onSubmit = (data: FormData) => {
    const token = mockLogin(data.email, data.password);
    if (token) router.push('/admin');
    else alert('Invalid credentials');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register('email')} placeholder="Email" className="border p-2" />
      {errors.email && <p>{errors.email.message}</p>}
      <input {...register('password')} type="password" placeholder="Password" className="border p-2" />
      {errors.password && <p>{errors.password.message}</p>}
      <button type="submit" className="bg-blue-500 text-white p-2">Login</button>
    </form>
  );
}