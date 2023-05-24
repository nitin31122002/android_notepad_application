import React, { useState, useEffect, useLayoutEffect } from 'react'
import { SafeAreaView, View, ScrollView, TextInput, TouchableOpacity , Button} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Style from './style';
import Save from '../../components/saveNote';
import Delete from '../../components/delNote';
import ModalNotification from '../../components/Notification';
import Voice from '@react-native-voice/voice';

export default function Notes({route,navigation}){
    const [pitch, setPitch] = useState('');
    const [error, setError] = useState('');
    const [end, setEnd] = useState('');
    const [started, setStarted] = useState('');
    const [results, setResults] = useState([]);
    const [partialResults, setPartialResults] = useState([]);
    const [date, setDate] = useState(new Date())
    const [note,setNote] = useState({
        title:'',
        note:'',
        date: date,
        notificationId: null
    });
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(()=>{
        if(route.params.note){
            setNote(route.params.note);
        }
    },[])
    useEffect(() => {
        Voice.onSpeechStart = onSpeechStart;
        Voice.onSpeechEnd = onSpeechEnd;
        Voice.onSpeechError = onSpeechError;
    
        Voice.onSpeechResults = onSpeechResults;
    
        Voice.onSpeechPartialResults = onSpeechPartialResults;
    
        Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;
    
     
    
        return () => {
    
    
          Voice.destroy().then(Voice.removeAllListeners);
    
        };
    
      }, []);
      const onSpeechStart = (e) => {
        console.log('onSpeechStart: ', e);
        setStarted('√');
      };
     
      const onSpeechEnd = (e) => {
        console.log('onSpeechEnd: ', e);
        setEnd('√');
      };
     
      const onSpeechError = (e) => {
        console.log('onSpeechError: ', e);
        setError(JSON.stringify(e.error));
      };
     
      const onSpeechResults = (e) => {
        console.log('onSpeechResults: ', e);
        setResults(e.value);
      };
     
      const onSpeechPartialResults = (e) => {
        console.log('onSpeechPartialResults: ', e);
        setPartialResults(e.value);
      };
     
      const onSpeechVolumeChanged = (e) => {
        console.log('onSpeechVolumeChanged: ', e);
        setPitch(e.value);
      };
     
      const startRecognizing = async () => {
        try {
          await Voice.start('en-US');
          setPitch('');
          setError('');
          setStarted('');
          setResults([]);
          setPartialResults([]);
          setEnd('');
        } catch (e) {
          
          console.error(e);
        }
      };
     
      const stopRecognizing = async () => {
        try {
          await Voice.stop();
        } catch (e) {
          console.error(e);
        }
      };
     
      const cancelRecognizing = async () => {
        try {
          await Voice.cancel();
        } catch (e) {
          console.error(e);
        }
      };
     
      const destroyRecognizer = async () => {
        try {
          await Voice.destroy();
          setPitch('');
          setError('');
          setStarted('');
          setResults([]);
          setPartialResults([]);
          setEnd('');
        } catch (e) {
          console.error(e);
        }
      };
    useLayoutEffect(()=>{
        navigation.setOptions({
            headerRight: () => {
                return(
                    <View style={{width: 150, flexDirection:'row', justifyContent: 'space-between', marginRight: 30}}>
                        <TouchableOpacity onPress={()=>Save(note, navigation)}>
                            <Feather name="save" size={24} color="black"/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>setModalVisible(!modalVisible)}>
                            <Feather name="bell" size={24} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>Delete(note, navigation)}>
                            <Feather name="trash-2" size={24} color="black"/>
                        </TouchableOpacity>
                    </View>
                )
            }  
        })
    },[navigation,note])

    return(
        <SafeAreaView style={Style.conteiner}>
            <TextInput 
                style={Style.txtTitleNote} 
                autoFocus={true} 
                maxLength={40}
                value={note.title} 
                placeholder={'Title'}
                onChangeText={text=>setNote({ ...note, title: text })}
            >
            </TextInput>
            <View>
                <TouchableOpacity onPress={startRecognizing}><Button title='start'></Button></TouchableOpacity>
                <TouchableOpacity onPress={stopRecognizing}><Button title='stop' ></Button></TouchableOpacity>
            </View>
            <ScrollView>
                <TextInput style={Style.txtInput} 
                    multiline={true} 
                    value={note.note}
                    placeholder={'Write the content here!'}
                    onChangeText={text=>setNote({ ...note, note: text })}
                    >
                </TextInput>
            </ScrollView>
            <ModalNotification modalVisible={modalVisible} setModalVisible={setModalVisible} date={date} setDate={setDate} note={note} setNote={setNote}/>
        </SafeAreaView>
    )
}