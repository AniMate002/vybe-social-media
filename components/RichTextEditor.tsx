import React, { useRef } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import {actions, RichEditor, RichToolbar} from 'react-native-pell-rich-editor';

interface IRichTextEditor {
    editorRef: any;
    onChange: (body: any) => void;
}

const RichTextEditor:React.FC<IRichTextEditor> = ({editorRef, onChange}) => {
    return (
        <View className='min-h-[200px]'>
            <RichToolbar 
                style={styles.richBar}
                flatContainerStyle={styles.flatStyle}    
                editor={editorRef}  
            />
            <RichEditor 
                containerStyle={styles.richContainer}
                editorStyle={styles.editorStyle}
                ref={editorRef}
                placeholder="Tell us what's on your mind..."
                onChange={onChange}
            />
        </View>
    )
}

export default RichTextEditor


const styles = StyleSheet.create({
    richBar: {
        borderTopEndRadius: 10,
        borderTopStartRadius: 10,
    },
    flatStyle: {

    },
    richContainer: {
        minHeight: 150,
        borderEndEndRadius: 10,
        borderEndStartRadius: 10,
    },
    editorStyle: {
        backgroundColor: "#f0f0f0",
    }
})