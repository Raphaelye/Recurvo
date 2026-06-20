import {View, Text, Image} from 'react-native'
import React from 'react'
import {formatCurrency} from "@/lib/utils";


const UpcomingSubscriptionCard = ({ name, price, daysLeft, icon, currency }:UpcomingSubscription) => {
    return (
        <View className="upcoming-card ">
            <View className="upcoming-row">
                <View className="img-container">
                    <Image source={icon} className="upcoming-icon" />
                </View>
                <View className='flex-1'>
                    <Text className="upcoming-name" ellipsizeMode='tail' numberOfLines={1}>{name}</Text>
                    <Text className="upcoming-price">{formatCurrency(price, currency)}</Text>   
                </View>
            </View>

            <View className=" upcoming-meta">
                <Text className="upcoming-meta-text " numberOfLines={1}>
                    {daysLeft > 1 ? `${daysLeft} days left` : 'Last day'}
                </Text>
            </View>
            
        </View>
    )
  }
export default UpcomingSubscriptionCard