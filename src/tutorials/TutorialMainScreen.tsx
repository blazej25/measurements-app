import React from 'react';
import {Text, View} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { DataBar } from '../components/input-bars';
import { colors, defaultBorderRadius, defaultGap, largeBorderRadius } from '../styles/common-styles';

// What you can see is a basic React component. The it is defined using this weird
// arrow function syntax because web devs like to claim that they are writing
// 'functional' programs. You can see some real functional programming here:
// https://www.haskell.org/. The syntax for specifying component arguments (or
// as sometimes referred to as properties (props)) is the following:
//
// ({arg1, arg2, arg3, ...}: {arg1: type-of-arg1, ...})
//
// The way to tink about this is that the thing after the colon ':' is the type
// of the whole json object of parameters. Basically the idea is that all
// components take in a single argument which is an object see here:
// https://www.typescriptlang.org/docs/handbook/2/objects.html and then we specify
// the type of that object in that other object after the colon. That's why it
// looks as if we were specifying the arguments twice.
export const TutorialMainScreen = ({navigation}: any) => {
  return (
    <View>
      <Text> Hello Błażej </Text>
    </View>
  );
};

// Consider the example below:
function TutorialMainScreenEquivalent({navigation}: any): JSX.Element {
  return (
    <View>
      <Text> Hello Błażej </Text>
    </View>
  );
};
// This is an equivalent syntax and it works fine, for some reason the syntax
// above is more frequently used. As you will notice it returns a JSX.Element
// type. This type is basically this enhanced html that you write inside of the
// return statement

// Note the export keyword, it makes the component globally available in the
// project so that it can be imported in other files like so
//
// import { TutorialMainScreen } from './src/tutorials/TutorialMainScreen';

// Below I will explain how one of the custom components works:
// This is the component responsible for giving you a dropdown list of choices
// on which you can click to set the selection.
const SelectorBar = ({ // Here are the props that you can configure on the SelectorBar
  label,          // Label of the bar in the ui e.g. 'RODZAJ PRZEWODU'
  selections,     // an array of the selection to choose from
  onSelect,       // custom function that you write to execute when the user makes a selection
  selectionToText,// convertion function which given the selection array gives you a different string.
                  // the purpose of this is that you migth want to display different text for selection depending on the language
}: {
  label: string;
  selections: string[];
  onSelect: (selectedItem: string, index: number) => void;
  selectionToText?: (selectedItem: string) => string;
}) => {
  // This object configures the style of each item in the selector.
  const selectorItemStyle = {
    borderRadius: defaultBorderRadius,
    backgroundColor: colors.secondaryBlue,
    marginBottom: defaultGap,
    height: 40,
    maxWidth: 130,
  };

  // This configures the whole dropdown box when open
  const dropdownStyle = {
    borderRadius: largeBorderRadius,
    padding: defaultGap,
    paddingBottom: 0,
    backgroundColor: colors.buttonBlue,
    // The height of the dropdown needs to include space for all selection items
    // plus the gaps between them
    height: Math.min(
      selectorItemStyle.height * selections.length + // Here we calculate the height of all selections plus the gaps between so the selection window shrinks if there aren't enough selections to fill it.
        defaultGap * (selections.length + 1),
      600,
    ),
  };

  // And finally here we return the actual JSX component
  return (
    <DataBar label={label}>
      <View style={{borderRadius: defaultBorderRadius}}>
        {selections.length != 0 ? ( // This is a ternary operator used for conditional rendering. You can see some explanation here: https://legacy.reactjs.org/docs/conditional-rendering.html#:~:text=Inline%20If%2DElse%20with%20Conditional%20Operator
          <SelectDropdown
            buttonStyle={selectorItemStyle}
            rowStyle={selectorItemStyle}
            dropdownStyle={dropdownStyle}
            defaultValue={selections[0]}
            buttonTextStyle={{fontSize: 14}}
            data={selections}
            // Here we delegate the call of the onSelect to our custom handler function
            // that was passed as in as a prop at the top of the component.
            // The idea is that the SelectDropdown is a built-in component that
            // exposes the onSelect prop to run when the selection is made, we
            // simply instruct it to run our handler function at that point.
            onSelect={(selectedItem, index) => {
              onSelect(selectedItem, index);
            }}
            // This is the custom handler so that once the selection is made,
            // the button text displays our selection, or the override imposed
            // by the selectionToText function.
            buttonTextAfterSelection={(selectedItem, _index) => {
              if (selectionToText) {
                return selectionToText(selectedItem);
              }
              return selectedItem;
            }}
            // Same here, if we defined that mapping from selection options to
            // the displayed text, we map it before showing to the user
            rowTextForSelection={(item, _index) => {
              if (selectionToText) {
                return selectionToText(item);
              }
              return item;
            }}
          />
        ) : (
          <SelectDropdown
            buttonStyle={selectorItemStyle}
            rowStyle={selectorItemStyle}
            dropdownStyle={dropdownStyle}
            buttonTextStyle={{fontSize: 14}}
            data={["Test"]}
            onSelect={() =>
              console.log('Dropdown selected when no selections available')
            }
          />
        )}
      </View>
    </DataBar>
  );
};

// Summarising the overall workflow is as follows: define props of a component,
// then when using it as a component, you can set them using that modifier syntax like
// so
//<SelectDropdown
//  buttonStyle={selectorItemStyle}
//  rowStyle={selectorItemStyle}
//  dropdownStyle={dropdownStyle}
//  buttonTextStyle={{fontSize: 14}}
//  data={["Test"]}
//  onSelect={() =>
//    console.log('Dropdown selected when no selections available')

