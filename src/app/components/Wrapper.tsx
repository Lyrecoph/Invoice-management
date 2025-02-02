import React from 'react';
import Navbar from './Navbar';

type WrapperProps = {
  children: React.ReactNode; // Contenu de la page à afficher
};

const Wrapper = ({ children }: WrapperProps) => {
  return (
    <div>
      {/* Inclusion de la barre de navigation */}
      <Navbar />
      {/* Zone de contenu avec paddings */}
      <div className='px-5 md:px-[10%] mt-8 mb-10'>
        {children}
      </div>
    </div>
  );
};

export default Wrapper;
