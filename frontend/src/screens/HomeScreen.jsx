import React from 'react';
import { useSelector } from 'react-redux';
import Hero from '../components/Hero';
import HeroUser from '../components/HeroUser';

const HomeScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <>
    {!userInfo &&    <Hero />}
   
      {userInfo && <HeroUser />} {/* Render HeroUser only if userInfo exists */}
    </>
  );
};

export default HomeScreen;
