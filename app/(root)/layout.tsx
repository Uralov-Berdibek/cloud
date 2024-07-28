import Auth from '@/components/auth';
import { getServerSession } from 'next-auth';
import React from 'react';
import { authOptions } from '../../lib/auth-options';
interface Props {
  children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  const session: any = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className='container h-screen mx-auto max-w-7xl'>
        <Auth />
      </div>
    );
  }

  return <div className='lg:container h-screen mx-auto lg:max-w-7xl'>{children}</div>;
};

export default Layout;
