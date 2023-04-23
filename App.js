import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Audio } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function App() {

    const [vertDirection, setVertDirection] = useState(0);
    const [direction, setDirection] = useState('Forward');
    const [prevVertDirection, setPrevVertDirection] = useState('Forward');
    const [leftBlinker, setLeftBlinker] = useState('gray');
    const [rightBlinker, setRightBlinker] = useState('gray');
    const [sound, setSound] = useState();
    let prev = 0;


    useEffect(() => {
        return sound ? () => {sound.unloadAsync()}: undefined;
    }, [sound]);

    async function playSound(currDirection) {
        pauseSound();
        if(currDirection == 'left'){
            const { sound } = await Audio.Sound.createAsync(require('./sound/300.wav'));
            setSound(sound);
            await sound.playAsync();
        }else{
            const { sound } = await Audio.Sound.createAsync(require('./sound/500.wav'));
            setSound(sound);
            await sound.playAsync();
        }
    }

    const pauseSound = async () => {
        setSound(null);
    };

    const onChangeDirection = (currDirection, prevDirection)=>{
        if(currDirection > 0.3){
            setDirection('Turning Right');
            if(prevDirection < 0.3){
                playSound('right');
            }
            setLeftBlinker('gray');
            setRightBlinker('red');
            setTimeout(()=>{
                setRightBlinker('gray');
            }, 1700);
        }else if(currDirection < -0.3){
            setDirection('Turning Left');
            if(prevDirection < -0.3){
                console.log(`Left: ${currDirection} -> ${prevDirection}`)
                playSound('left');
            }
            setRightBlinker('gray');
            setLeftBlinker('red');
            setTimeout(()=>{
                setLeftBlinker('gray');
            }, 1700);
        }else{
            pauseSound();
            setDirection('Forward');
            setLeftBlinker('gray');
            setRightBlinker('gray');
        }
    }

    const onChange = () => {
        Accelerometer.addListener(data => {
            onChangeDirection(data.y, prev);
            setVertDirection(data.y);
            setPrevVertDirection(data.y);
            prev= data.y;
        });
    };

    useEffect(() => {
        onChange();
    }, []);


  return (
    <View style={styles.Main}>
        <View style = {{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <MaterialCommunityIcons name="chevron-triple-left" size={100} color={leftBlinker} />
        <View style = {{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginHorizontal: 100}}>
        <Text style = {styles.Dir}>{direction}</Text>
        <Text style = {{color: 'white'}}>{vertDirection}</Text>
        </View>
        <MaterialCommunityIcons name="chevron-triple-right" size={100} color={rightBlinker} />
        </View>
    </View>
  );
}
const styles = StyleSheet.create({
    Main:{
        display: 'flex',
        flexDirection: 'column',
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: 'black'
    },
    Dir:{
        fontSize: 50,
        fontWeight: '300',
        color: 'white'
    },
    Indicator:{
        width: 80,
        height: 80,
        borderColor: 'black',
        backgroundColor: 'gray',
        borderRadius: 100
    }
});
