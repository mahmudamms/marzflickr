import NetInfo from "@react-native-community/netinfo";

var list_data = [];

NetInfo.fetch().then(state => {
    list_data.push(
        type = 'test'
    );
});

export default [
    {
      data: list_data,
    }
]