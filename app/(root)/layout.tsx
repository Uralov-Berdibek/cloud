import Auth from '@/components/auth';
import { getServerSession } from 'next-auth';
import React from 'react';
interface Props {
  children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  const user = false;

  if (!user) {
    return (
      <div className='container h-screen mx-auto max-w-7xl'>
        <Auth />
      </div>
    );
  }

  return <div className='lg:container h-screen mx-auto lg:max-w-7xl'>{children}</div>;
};

export default Layout;
