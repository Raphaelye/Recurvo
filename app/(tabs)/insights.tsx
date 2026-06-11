import { View, Text } from 'react-native'
import React from 'react'
import { StyledSafeAreaView } from '@/components/StyledSafeAreaView'

const insights = () => {
  return (
    <StyledSafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-2xl font-sans-extrabold text-muted">
          Insights Screen
      </Text>
    </StyledSafeAreaView>
  )
}

export default insights