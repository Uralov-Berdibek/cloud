import useLoginModal from '@/hooks/useLoginModal';
import useRegisterModal from '@/hooks/useRegisterModal';
import { registerStep1Schema, registerStep2Schema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { AlertCircle } from 'lucide-react';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import Button from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import Modal from '../ui/modal';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

export default function RegisterModal() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();

  const onToggle = useCallback(() => {
    registerModal.onClose();
    loginModal.onOpen();
  }, [loginModal, registerModal]);

  const bodyContent =
    step === 1 ? (
      <RegisterStep1 setData={setData} setStep={setStep} />
    ) : (
      <RegisterStep2 data={data} />
    );

  const footer = (
    <div className='text-neutral-400 text-center mb-4'>
      <p>
        Already have an account?{' '}
        <span className='text-black cursor-pointer hover:underline' onClick={onToggle}>
          Sign in
        </span>
      </p>
    </div>
  );

  return (
    <Modal
      body={bodyContent}
      footer={footer}
      isOpen={registerModal.isOpen}
      onClose={registerModal.onClose}
      step={step}
      totalSteps={2}
    />
  );
}

function RegisterStep1({
  setData,
  setStep,
}: {
  setData: Dispatch<
    SetStateAction<{
      firstname: string;
      lastname: string;
      email: string;
      password: string;
      confirmPassword: string;
    }>
  >;
  setStep: Dispatch<SetStateAction<number>>;
}) {
  const [error, setError] = useState('');

  const form = useForm<z.infer<typeof registerStep1Schema>>({
    resolver: zodResolver(registerStep1Schema),
    defaultValues: {
      email: '',
      firstname: '',
      lastname: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (formData: z.infer<typeof registerStep1Schema>) => {
    try {
      const response = await axios.post('http://localhost:8090/api/v1/auth/register', formData);
      setData({
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      setStep(2);
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <Form {...form}>
      <form className='space-y-4 px-12' onSubmit={form.handleSubmit(onSubmit)}>
        {error && (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className='flex items-center gap-2'>
          <FormField
            control={form.control}
            name='firstname'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder='First name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='lastname'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder='Last name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder='Email' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex items-center gap-2'>
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder='Password' type='password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder='Password' type='password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button label={'Next'} type='submit' secondary fullWidth padding disabled={isSubmitting} />
      </form>
    </Form>
  );
}

function RegisterStep2({ data }: { data: { firstname: string; lastname: string; email: string } }) {
  const [error, setError] = useState('');
  const registerModal = useRegisterModal();

  const form = useForm<z.infer<typeof registerStep2Schema>>({
    resolver: zodResolver(registerStep2Schema),
    defaultValues: {
      email_password: '',
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (formData: z.infer<typeof registerStep2Schema>) => {
    try {
      await axios.get(`http://localhost:8090/api/v1/auth/activate-account`, {
        params: { token: formData.email_password },
      });
      registerModal.onClose();
      // Redirect to the main page or handle success as needed
      window.location.href = '/';
    } catch (error) {
      setError('Activation failed. Please try again.');
    }
  };

  return (
    <Form {...form}>
      <form className='space-y-4 px-12' onSubmit={form.handleSubmit(onSubmit)}>
        {error && (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name='email_password'
          render={({ field }) => (
            <InputOTP maxLength={6}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          )}
        />
        <Button
          label={'Register'}
          type='submit'
          secondary
          fullWidth
          padding
          disabled={isSubmitting}
        />
      </form>
    </Form>
  );
}
