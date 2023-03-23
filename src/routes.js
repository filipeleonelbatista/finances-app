import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import AboutUs from './pages/AboutUs';
import Finances from './pages/Finances';
import Runs from './pages/Runs';

const Stack = createStackNavigator();

export default function Routes() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName='Combustível'
                screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#F2F3F5' } }}
            >
                <Stack.Screen
                    name="Finanças"
                    component={Finances}
                />
                <Stack.Screen
                    name="Combustível"
                    component={Runs}
                />
                <Stack.Screen
                    name="Sobre"
                    component={AboutUs}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
