/**
* Sample React Native App
* https://github.com/facebook/react-native
* @flow
*/

import React, { Component } from 'react';
import {
  AppRegistry,
  Dimensions,
  TouchableHighlight,
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  Alert,
  PanResponder,
  Animated,
  NativeModules,
} from 'react-native';
import Camera from 'react-native-camera';
//import SketchView from 'react-native-sketch-view';
import Sketch from 'react-native-sketch';
import ThemePicker from 'react-native-theme-picker';
import RNFS from 'react-native-fs';

//console.log(NativeModules.CalendarManager);
//NativeModules.CalendarManager.addEventWithName('One', 'Two', 3);


/*
const sketchViewConstants = SketchView.constants;

const tools = {};

tools[sketchViewConstants.toolType.pen.id] = {
  id: sketchViewConstants.toolType.pen.id,
  name: sketchViewConstants.toolType.pen.name,
  nextId: sketchViewConstants.toolType.eraser.id
};
tools[sketchViewConstants.toolType.eraser.id] = {
  id: sketchViewConstants.toolType.eraser.id,
  name: sketchViewConstants.toolType.eraser.name,
  nextId: sketchViewConstants.toolType.pen.id
};*/

const themes = [
  { background: 'red' },
  { background: 'yellow' },
  { background: 'pink' },
  { background: 'green' },
  { background: 'purple' },
]


export default class App extends Component<{}> {

  state = {
    picture: null,
    picturePath: null,
    //toolSelected: sketchViewConstants.toolType.pen.id,
    background: 'red',
    pan: new Animated.ValueXY(),
    showDraggable: true,
    dropZoneValues: null,
  }

  panResponder = PanResponder.create({
        onStartShouldSetPanResponder : () => true,
        onPanResponderMove           : Animated.event([null,{
            dx : this.state.pan.x,
            dy : this.state.pan.y
        }]),
        onPanResponderRelease: (e, gesture) => {
          if(this.isDropZone(gesture)) {
            /*this.setState({
              showDraggable: false,
            })*/

          } else {

          Animated.spring(
          this.state.pan,
          {toValue:{x:0,y:0}}
       ).start();
        }
      }
    });

    isDropZone(gesture){
      console.log(gesture);
      var dz = this.state.dropZoneValues;
      console.log(gesture.moveY);
      console.log(dz);
      return gesture.moveY > (dz.y+72) && gesture.moveY < (dz.y + dz.height+72);
    }
/*
  isEraserToolSelected() {
    return this.state.toolSelected === sketchViewConstants.toolType.eraser.id;
  }

  toolChangeClick() {
    this.setState({toolSelected: tools[this.state.toolSelected].nextId});
  }

  getToolName() {
    return tools[this.state.toolSelected].name;
  }

  onSketchSave(saveEvent) {
    this.props.onSave && this.props.onSave(saveEvent);
  }*/

  renderDraggable(){
    if (this.state.showDraggable) {
      return (
        <View style={styles.draggableContainer}>
          <Animated.View
            {...this.panResponder.panHandlers}
            style={[this.state.pan.getLayout(), styles.circle]}>
            <Text style={styles.text}>Drag me!</Text>
          </Animated.View>
        </View>
      );
    }
  }

  save = () => {
    this.sketch.save().then(({ path }) => {
      Alert.alert('Image saved!', path);
    });
  };
  clear = () => this.sketch.clear();

  takePicture() {
    const options = {};
    //options.location = ...
    this.camera.capture(options)
    .then((data) => {
      console.log(data);
      let base64Img = data.path;

          RNFS.readFile( base64Img, 'base64' )
            .then( res => this.setState( { uri: res } ) )
      this.setState({
        picture: data.path,
      })
    })
    .catch(err => console.error(err));
  }

  _selectColor = color => {
    this.setState({
      background: color,
    });
  }

  setDropZoneValues(event)  {
    this.setState({
        dropZoneValues : event.nativeEvent.layout
    });
}

  render() {
    return (

      <View style={{ flex: 1}}>
        { this.state.picture ?

          <View style={{flex: 1, flexDirection: 'column'}}>

            <View style={{ flexDirection: 'row', backgroundColor: "grey"}} >
              <ThemePicker
                colors={themes.map(theme=>theme.background)}
                selectedColor={this.state.background}
                onSelected={(color)=>this._selectColor(color)}/>
            </View>

            <View style={{ flex: 1 }}>
        <Sketch
          ref={sketch => {
            this.sketch = sketch;
          }}
          strokeColor={this.state.background}
          strokeThickness={3}
          imageData={this.state.picture}
        />
        <View
          onLayout={this.setDropZoneValues.bind(this)}
          style={styles.dropZone}>
          <Text style={styles.text}>Drop me here!</Text>
        </View>

        {this.renderDraggable()}
        <View style={{flexDirection: 'row'}} >
          <Button onPress={this.save} title="Save" />
          <Button onPress={this.clear} title="Clear" />
          <Button onPress={()=> this.setState({ picture: null })} title="Retake" />
        </View>
      </View>


            </View> :
            <Camera
                   ref={(cam) => {
                     this.camera = cam;
                   }}
                   captureTarget={Camera.constants.CaptureTarget.disk}
                   style={styles.preview}
                   aspect={Camera.constants.Aspect.fit}>

                   <TouchableHighlight
                     style={styles.button}
                     onPress={this.takePicture.bind(this)}
                   >
                     <View
                       style={styles.viewButton}
                     />
                   </TouchableHighlight>
                 </Camera>
               }
               </View>


        );
      }
    }
    let CIRCLE_RADIUS = 36;
    let Window = Dimensions.get('window');
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        flexDirection: 'row',
      },
      preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
      },
      button: {
        height: 54,
        width: 54,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 52 / 2,
        padding: 10,
        margin: 40
      },
      viewButton: {
        borderWidth: 1,
        borderColor: 'black',
        height: 44,
        width: 44,
        borderRadius: 42 / 2,
      },
      capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        color: '#000',
        padding: 10,
        margin: 40
      },
      mainContainer: {
        flex    : 1
      },
      dropZone    : {
        height         : 100,
        backgroundColor:'#2c3e50'
      },
      text        : {
        marginTop   : 25,
        marginLeft  : 5,
        marginRight : 5,
        textAlign   : 'center',
        color       : '#fff'
      },
      draggableContainer: {
        position    : 'absolute',
        top         : Window.height/2 - CIRCLE_RADIUS,
        left        : Window.width/2 - CIRCLE_RADIUS,
      },
      circle      : {
        backgroundColor     : '#1abc9c',
        width               : CIRCLE_RADIUS*2,
        height              : CIRCLE_RADIUS*2,
        borderRadius        : CIRCLE_RADIUS
      }
    });
