'use client';

import useLoginModal from '@/hooks/useLoginModal';
import useRegisterModal from '../../hooks/useRegisterModal';
import Image from 'next/image';
import { useCallback } from 'react';
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import Button from '../ui/button';
import { signIn, useSession } from 'next-auth/react';
import LoginModal from '../modals/login-modal';
import RegisterModal from '../modals/register-modal';

export default function AuthComponent() {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();

  const { data } = useSession();

  const onOpenRegisterModal = useCallback(() => {
    registerModal.onOpen();
  }, [registerModal]);

  const onOpenLoginModal = useCallback(() => {
    loginModal.onOpen();
  }, [loginModal]);

  return (
    <>
      <RegisterModal />
      <LoginModal />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10 items-center h-screen'>
        <Image
          src={'/cloud.png'}
          alt='Cloud'
          width={350}
          height={100}
          className='justify-self-center hidden md:block'
        />
        <div className='flex flex-col justify-center md:justify-between gap-6 h-full md:h-[70vh]'>
          <div className='block md:hidden'>
            <Image src={'/cloud.png'} alt='Cloud' width={130} height={40} />
          </div>
          <h1 className='text-6xl font-bold sm:text-4xl'>Happening now.</h1>
          <div className='w-full md:w-[60%]'>
            <h2 className='font-bold text-3xl mb-4'>Join today.</h2>
            <div className='flex flex-col space-y-2'>
              <Button
                label={
                  <div
                    className='flex gap-2 items-center justify-center'
                    onClick={() => signIn('google')}
                  >
                    <FcGoogle />
                    Sign up with Google
                  </div>
                }
                fullWidth
                secondary
              />
              <Button
                label={
                  <div
                    className='flex gap-2 items-center justify-center'
                    onClick={() => signIn('github')}
                  >
                    <AiFillGithub />
                    Sign up with Github
                  </div>
                }
                fullWidth
                secondary
              />
              <div className='flex items-center justify-center'>
                <div className='h-px bg-gray-700 w-1/2' />
                <p className='mx-4'>or</p>
                <div className='h-px bg-gray-700 w-1/2' />
              </div>
              <Button label={'Create account'} fullWidth onClick={onOpenRegisterModal} />
              <div className='text-[10px] text-gray-400'>
                By signing up, you agree to the{' '}
                <span className='text-sky-500'>Terms of Service</span> and
                <span className='text-sky-500'> Privacy Policy</span>, including
                <span className='text-sky-500'> Cookie Use</span>.
              </div>
            </div>
          </div>
          <div className='w-full md:w-[60%]'>
            <h3 className='font-medium text-xl mb-4'>Already have an account?</h3>
            <Button label={'Sign in'} fullWidth outline onClick={onOpenLoginModal} />
          </div>
        </div>
      </div>
    </>
  );
}
