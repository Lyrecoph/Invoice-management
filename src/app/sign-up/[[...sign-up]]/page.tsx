import React from 'react';
import { SignUp } from '@clerk/nextjs';

const page = () => {
  return (
    <div className='hero bg-base-200 min-h-screen'>
      <div className='hero-content text-center'>
        <div className='max-w-md'>
          {/* Composant d'inscription fourni par Clerk */}
          <SignUp />
        </div>
      </div>
    </div>
  );
};

export default page;
