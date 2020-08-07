import React from "react";
import {Image, View , Text} from "react-native";
import {BorderlessButton} from "react-native-gesture-handler";

import backIcon from '../../assets/images/icons/back.png';
import logoImg from '../../assets/images/logo.png';
import { useNavigation } from '@react-navigation/native';

import styles from "./styles";

interface PageHeaderProps {
    title: string;
}

const PageHeader: React.FC<PageHeaderProps> = ( { title }) =>{

    const { navigation } = useNavigation();
    function handleGoBack() {
        navigation('Landing');
    }
    return (
        <View style={styles.container}>
            <View style={styles.toBar}>
                <BorderlessButton onPress={handleGoBack}>
                    <Image source={backIcon} resizeMode="contain"/>
                </BorderlessButton>
                <Image source={logoImg} resizeMode="contain"/>
            </View>
            <Text style={styles.title}>{title}</Text>
        </View>
        );
}

export default PageHeader;