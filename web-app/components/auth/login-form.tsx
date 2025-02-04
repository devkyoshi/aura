'use client';

import { cn, toAbsoluteUrl } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import React, { useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import { House } from 'lucide-react';
import { APP_CONSTANTS } from '@/config/app.constants';


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const { login, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2 relative">

          <div className={'absolute top-4 left-4'}>
            <Link href={'/'}>
              <Button variant={'outline'} className={'rounded-full w-8 h-8 p-2 hover:bg-primary/10 hover:text-primary'}>
                <House />
              </Button>
            </Link>
          </div>
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              <div className="flex flex-col items-center text-center">
                <div className={'flex items-center '}>
                  <p className={'text-lg font-semibold text-primary'}>{APP_CONSTANTS.APP_NAME}</p>
                  <img className={'w-5 h-5 -mt-1'} alt={'logo'}  src={toAbsoluteUrl('/media/images/app-logo.png')}/>
                </div>
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your Aura account
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="username">User Name</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="aura@me"
                  required
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/auth/login"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="*********"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>

              {/* Social Login Buttons (Omitted for brevity - same as original) */}

              <div className="text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link
                  href="/auth/signup"
                  className="underline underline-offset-4"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </form>

          <div className="relative hidden bg-muted md:block">
            <img
              src={toAbsoluteUrl('/media/images/login-image.jpg')}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover "
            />
          </div>
        </CardContent>
      </Card>



      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our{' '}
        <Link href="/terms">Terms of Service</Link> and{' '}
        <Link href="/privacy">Privacy Policy</Link>.
      </div>



    </div>
  );
}
