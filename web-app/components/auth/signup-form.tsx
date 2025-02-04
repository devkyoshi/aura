'use client';

import { cn, toAbsoluteUrl } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronLeft, ChevronRight, House } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { registerUser } from '@/services/auth.service';
import { APP_CONSTANTS } from '@/config/app.constants';


const steps = [
  { title: 'Personal Info', fields: ['first_name', 'last_name', 'email', 'phone'] },
  { title: 'Address', fields: ['address', 'city', 'postal_code', 'country'] },
  { title: 'Account', fields: ['username', 'password', 'role'] },
  { title: 'Review', fields: [] },
];

export const signupFormSchema = z.object({
  first_name: z.string().min(2, 'Minimum 2 characters'),
  last_name: z.string().min(2, 'Minimum 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^0\d{9}$/, 'Invalid phone number format'),
  address: z.string().min(5, 'Address too short'),
  city: z.string().min(2, 'City name too short'),
  postal_code: z.string().min(4, 'Invalid postal code'),
  country: z.string().min(2, 'Country name too short'),
  username: z.string().min(3, 'Minimum 3 characters'),
  password: z.string().min(8, 'Minimum 8 characters'),
  role: z.enum(['instructor', 'student']),
});

export function SignupForm({ className, ...props }: React.ComponentProps<'div'>) {
  const [currentStep, setCurrentStep] = useState(0);
  const [previousStep, setPreviousStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loading, error } = useAuth();
  const router = useRouter();
  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postal_code: '',
      country: '',
      username: '',
      password: '',
      role: 'student',
    },
  });

  const handleSubmit = async (values: z.infer<typeof signupFormSchema>) => {
    // Only submit if we're on the final step
    console.log(currentStep, steps.length);
    if (!isSubmitting) {
      return;
    }
    const is_registered = await registerUser(values);
    if (is_registered) {
      form.reset();
      router.push('/auth/login');
    }
  };


  const nextStep = async () => {
    const fields = steps[currentStep].fields;
    const isValid = await form.trigger(fields as any);

    if (isValid) {
      setPreviousStep(currentStep);
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };


  const prevStep = () => {
    setPreviousStep(currentStep);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    setIsSubmitting(false);
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden ">
        <CardContent className="grid p-0 md:grid-cols-5 relative">
          <div className={'absolute top-4 left-4'}>
           <Link href={'/'}>
             <Button variant={'outline'} className={'rounded-full w-8 h-8 p-2 hover:bg-primary/10 hover:text-primary'}>
               <House />
             </Button>
           </Link>
          </div>
          <Form {...form}>
            <form
              className="p-6 md:p-8 col-span-3"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <div className="flex flex-col gap-6">
                {error && (
                  <div className="text-red-500 text-sm text-center">{error}</div>
                )}

                <div className="flex flex-col items-center text-center">
                  <div className={'flex items-center '}>
                    <p className={'text-lg font-semibold text-primary'}>{APP_CONSTANTS.APP_NAME}</p>
                    <img className={'w-5 h-5 -mt-1'} alt={'logo'}  src={toAbsoluteUrl('/media/images/app-logo.png')}/>
                  </div>
                  <h1 className="text-2xl font-bold">Create your account</h1>
                  <p className="text-balance text-muted-foreground">
                    Join Aura in just a few steps
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-muted rounded-full ">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Stepper Indicators */}
                {/*<div className="flex justify-between mb-2">*/}
                {/*  {steps.map((step, index) => (*/}
                {/*    <div*/}
                {/*      key={step.title}*/}
                {/*      className={`flex flex-col items-center w-1/4 ${*/}
                {/*        index <= currentStep ? 'text-primary' : 'text-muted-foreground'*/}
                {/*      }`}*/}
                {/*    >*/}
                {/*      <div*/}
                {/*        className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${*/}
                {/*          index <= currentStep*/}
                {/*            ? 'bg-primary text-primary-foreground'*/}
                {/*            : 'bg-muted'*/}
                {/*        }`}*/}
                {/*      >*/}
                {/*        {index === 0 ? (<Laugh/>): index === 1 ? (<MapPinHouse/>) : index === 2 ? (<CircleUser/>) :(<Star/>)}*/}
                {/*      </div>*/}
                {/*      <span className="text-sm text-center">{step.title}</span>*/}
                {/*    </div>*/}
                {/*  ))}*/}
                {/*</div>*/}

                {/* Animated Form Steps */}
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: currentStep > previousStep   ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: currentStep > previousStep  ? -50 : 50 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {currentStep === 0 && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="first_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input {...field}  />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="last_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input  {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input  {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input  {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {currentStep === 1 && (
                    <>
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Main Street" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="Colombo" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="postal_code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Postal Code</FormLabel>
                              <FormControl>
                                <Input placeholder="12345" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input placeholder="Sri Lanka" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {currentStep === 2 && (
                    <>
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input  {...field} />
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
                              <Input type="password"  {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Who You Are</FormLabel>
                            <FormControl>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* Student Option */}
                                <div
                                  className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                                    field.value === 'student'
                                      ? 'border-primary bg-primary/10'
                                      : 'border-muted hover:border-primary/30'
                                  }`}
                                  onClick={() => field.onChange('student')}
                                  role="button"
                                  tabIndex={0}
                                  onKeyDown={(e) => e.key === 'Enter' && field.onChange('student')}
                                >
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={toAbsoluteUrl('/media/images/student-profile.jpg')}
                                      alt="Student"
                                      className="h-14 w-14 sm:h-16 sm:w-16 object-cover rounded-full"
                                    />
                                    <div className="flex flex-col items-start gap-1 sm:gap-3">
                                      <h4 className="font-medium text-sm">Student</h4>
                                      <p className="text-xs text-muted-foreground">Learn new skills and track progress</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Instructor Option */}
                                <div
                                  className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                                    field.value === 'instructor'
                                      ? 'border-primary bg-primary/10'
                                      : 'border-muted hover:border-primary/30'
                                  }`}
                                  onClick={() => field.onChange('instructor')}
                                  role="button"
                                  tabIndex={0}
                                  onKeyDown={(e) => e.key === 'Enter' && field.onChange('instructor')}
                                >
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={toAbsoluteUrl('/media/images/teacher-profile.png')}
                                      alt="Instructor"
                                      className="h-14 w-14 sm:h-16 sm:w-16 object-cover rounded-full"
                                    />
                                    <div className="flex flex-col items-start gap-1 sm:gap-3">
                                      <h4 className="font-medium text-sm">Instructor</h4>
                                      <p className="text-xs text-muted-foreground">Teach courses and manage students</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                    </>
                  )}

                  {currentStep === 3 && (
                    <div className="rounded-lg border p-4">
                      <h3 className="mb-4 text-lg font-semibold">Review Your Details</h3>
                      <dl className="grid grid-cols-2 gap-4">
                        {Object.entries(form.getValues()).map(([key, value]) => (
                          <div key={key}>
                            <dt className="text-sm font-medium text-muted-foreground capitalize">
                              {key.replace('_', ' ')}
                            </dt>
                            <dd className="text-sm">
                              {key === 'role' ? (
                                <Badge variant={"outline"} className="uppercase">
                                  {value}
                                </Badge>
                              ) : (
                                value
                              )}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}
                </motion.div>

                <div className="flex justify-between">
                  {currentStep > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={loading}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                    </Button>
                  )}
                  {currentStep < steps.length - 1 ? (
                    <Button
                      size={'sm'}
                      type="button"
                      className="ml-auto"
                      onClick={nextStep}
                      disabled={loading}
                    >
                      Next <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                   ""
                  )}
                  {currentStep === steps.length - 1 && (
                    <Button
                      type="submit"
                      className="ml-auto"
                      disabled={loading}
                      onClick={() => setIsSubmitting(true)}
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  )}
                </div>

                <div className="text-xs flex flex-rows items-center gap-2 justify-center ">

                <div className={''}>  Already have an account?{' '}
                  <Link
                    href="/auth/login"
                    className="underline underline-offset-4"
                  >
                    Login
                  </Link></div>
                </div>
              </div>
            </form>
          </Form>
          <div className="relative hidden bg-muted md:block col-span-2">
            <img
              src={toAbsoluteUrl('/media/images/signup-img.jpg')}
              alt="Signup Illustration"
              className="absolute inset-0 h-full w-full object-cover"
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