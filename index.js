import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert} from 'react-native';
import React, { useRef, useState} from 'react';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import firebase from 'firebase/compat/app';
import { firebaseConfig } from '../config';

const Otp = () => {

    const [phoneNumber, setPhoneNumber] = useState('');
    const [code, setCode] = useState('');
    const [verificationId, setVerificationId] = useState(null);
    const recaptchaVerifier = useRef(null);
    
    const sendVerification = () => {
        const phoneProvider = new firebase.auth.PhoneAuthProvider();
        phoneProvider
            .verifyPhoneNumber(phoneNumber, recaptchaVerifier.current)
            .then(setVerificationId);
            setPhoneNumber('');
    };

    const confrimCode = () => {
        const credential = firebase.auth.PhoneAuthProvider.credential(
            verificationId,
            code
        );
        firebase.auth().signInWithCredential(credential)
        .then(() => {
            setCode('');
        })
        .catch((error) => {
            // show an alert in case of error
            alert(error);
        })
        Alert.alert(
            'Login Succesful. Welcome to Dashboard',
        );
    }

    return (
        <View style = {styles.container}>
            <FirebaseRecaptchaVerifierModal 
                ref = {recaptchaVerifier}
                firebaseConfig = {firebaseConfig}
            />
            <Text style = {styles.otpText}>
                Login using OTP
            </Text>
            <TextInput
                placeholder='Phone Number with country code'
                onChangeText={setPhoneNumber}
                keyboardType= 'phone-pad'
                autoCompleteType='tel'
                style = {styles.textInput}
            />
            <TouchableOpacity style = {styles.sendVerification} onPress = {sendVerification}>
                <Text style = {styles.buttonText}>
                    Send verification
                </Text>
            </TouchableOpacity>
            <TextInput 
                placeholder='Confrim code'
                onChangeText={setCode}
                keyboardType= 'number-pad'
                style = {styles.textInput}
            />
             <TouchableOpacity style = {styles.sendCode} onPress = {confrimCode}>
                <Text style = {styles.buttonText}>
                    Confrim verification
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default Otp

const styles = StyleSheet.create ({
    container: {
        flex: 1,
        backgroundColo: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textInput: {
        paddingTop: 40,
        paddingBottom: 20,
        paddingHorizontal: 20,
        fontSize: 24,
        borderBottomColor: 'black',
        marginBottom: 20,
        borderBottomWidth: 2,
        textAlign: 'center',
        color: 'black'
    },
    sendVerification: {
        padding: 20,
        backgroundColor: '#3498db',
        borderRadius: 10
    },
    sendCode: {
        padding: 20,
        backgroundColor: '#9b59b6',
        borderRadius: 10
    },
    buttonText: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold'
    },
    otpText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        margin: 20
    }
});
