import { View, Text } from 'react-native'
import React from 'react'
import { Image } from 'react-native'
import { useWindowDimensions } from 'react-native';

const OnboardingItem = ({ title, description, image }: Onboarding ) => {

  const { width } = useWindowDimensions();
  
  return (
    <Image source={image} className="h-4/6 w-full" style={{ width }} resizeMode="cover" />
    
  )
}

export default OnboardingItem

