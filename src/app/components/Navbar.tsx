'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';
import { Layers } from 'lucide-react';
import { checkAndAddUser } from '../actions';

const Navbar = () => {
  const pathname = usePathname(); // Récupère le chemin actuel
  const { user } = useUser(); // Récupère l'utilisateur connecté via Clerk

  // Liens de navigation (actuellement un seul lien vers la page d'accueil)
  const navLinks = [
    {
      href: '/',
      label: 'Factures'
    },
  ];

  // Appel à l'action de vérification/ajout de l'utilisateur dès que l'utilisateur change
  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress && user.fullName) {
      checkAndAddUser(user?.primaryEmailAddress?.emailAddress, user.fullName);
    }
  }, [user]);

  // Vérifie si un lien correspond au chemin actuel pour le marquer comme actif
  const isActiveLink = (href: string) =>
    pathname.replace(/\/$/, "") === href.replace(/\/$/, "");

  // Génère les liens de navigation
  const renderLinks = (classNames: string) =>
    navLinks.map(({ href, label }) => {
      return (
        <Link
          href={href}
          key={href}
          className={`btn-sm btn ${classNames} ${isActiveLink(href) ? 'btn-accent' : ''}`}
        >
          {label}
        </Link>
      );
    });

  return (
    <div className='border-b border-base-300 px-5 md:px-[10%] py-4'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center'>
          {/* Logo et nom de l'application */}
          <div className='bg-accent-content text-accent rounded-full p-2'>
            <Layers className='h-6 w-6' />
          </div>
          <span className='ml-3 font-bold text-2xl italic'>
            In<span className='text-accent'>Voice</span>
          </span>
        </div>
        <div className='flex space-x-4 items-center'>
          {/* Liens de navigation */}
          {renderLinks("btn")}
          {/* Bouton utilisateur fourni par Clerk */}
          <UserButton />
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default Navbar;
