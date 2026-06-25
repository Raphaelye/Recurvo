import { View, Text } from 'react-native'
import React from 'react'
import { StyledSafeAreaView } from '@/components/StyledSafeAreaView'

const insights = () => {
  return (
    <StyledSafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-3xl font-sans-extrabold text-foreground mb-10">
        Analytics
      </Text>
    </StyledSafeAreaView>
  )
}

export default insights