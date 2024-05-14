import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingTop: 70,
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        textTransform: "uppercase",
        textAlign: "center",
        paddingVertical: 40,
        color: "black"
    },
    inputView: {
        gap: 15,
        width: "100%",
        paddingHorizontal: 30,
        marginBottom: 5
    },
    input: {
        height: 50,
        paddingHorizontal: 20,
        borderColor: "green",
        borderWidth: 1,
        borderRadius: 7
    },
    button: {
        backgroundColor: "green",
        height: 45,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold"
    },
    buttonView: {
        paddingTop: 10,
        width: "100%",
        paddingHorizontal: 30
    },
    footerText: {
        paddingTop: 10,
        textAlign: "center",
        color: "gray",
    },
    signup: {
        color: "blue",
        fontSize: 13
    }
});
