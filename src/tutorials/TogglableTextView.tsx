
// def add(x, y):
// def add(x, y, z):
// add(x, y)
// We need state -> useState()
// map(int, list)

import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

// int: ((string) => number)
const TogglableTextView = () => {
  const [toggled, setToggled]: [toggled: boolean, setToggled: React.Dispatch<React.SetStateAction<boolean>>] = useState(false);
  return (<View>
    {toggled && <Text>The thing is toggled</Text>}
    <TouchableOpacity onPress={() => setToggled(!toggled)}><Text>Press me!</Text></TouchableOpacity>
  </View>);
}
// x = 5
// const [x, setX] = useState(0);
// x is 0 here
// setX(5)
// x is 5 here

// What's the difference between export and export default.
// https://stackoverflow.com/questions/33305954/typescript-export-vs-default-export
export default TogglableTextView;