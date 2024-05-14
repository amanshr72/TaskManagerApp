import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from "react-native";
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomSelectDropdown = ({ data, onSelect, label, selectedValue }) => {
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        setSelectedItem(selectedValue);
    }, [selectedValue]);

    return (
        <SelectDropdown
            data={data}
            selectedValue={selectedValue}
            onSelect={(item) => {
                setSelectedItem(item.name);
                onSelect(item);
            }}
            renderButton={(category, isOpened) => {
                return (
                    <View style={styles.dropdownButtonStyle}>
                        <Text style={styles.dropdownButtonTxtStyle}>
                            {(selectedItem && selectedItem) || `Select ${label}`}
                        </Text>
                        <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
                    </View>
                );
            }}
            renderItem={(item, isSelected) => {
                return (
                    <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                        <Text style={styles.dropdownItemTxtStyle}>{item.name}</Text>
                    </View>
                );
            }}
            showsVerticalScrollIndicator={false} dropdownStyle={styles.dropdownMenuStyle}
        />
    );
};

export default CustomSelectDropdown;

const styles = StyleSheet.create({
    dropdownButtonStyle: {
        width: '100%',
        height: 50,
        backgroundColor: '#E9ECEF',
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
        color: '#151E26',
    },
    dropdownButtonArrowStyle: {
        fontSize: 30,
    },
    dropdownMenuStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
    },
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
    },
    dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
});