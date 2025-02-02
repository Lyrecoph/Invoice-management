import React from 'react';
import { SignIn } from '@clerk/nextjs';

const page = () => {
  return (
    <div className='hero bg-base-200 min-h-screen'>
      <div className='hero-content text-center'>
        <div className='max-w-md'>
          {/* Composant de connexion fourni par Clerk */}
          <SignIn />
        </div>
      </div>
    </div>
  );
};

export default page;
