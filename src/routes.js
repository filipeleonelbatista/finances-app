import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import AboutUs from './pages/AboutUs';
import Finances from './pages/Finances';

const Stack = createStackNavigator();

export default function Routes() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#F2F3F5' } }}>
                <Stack.Screen name="Finances" component={Finances} />
                <Stack.Screen name="AboutUs" component={AboutUs} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
