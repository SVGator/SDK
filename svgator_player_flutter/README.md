# svgator_player_flutter

SVGator's animation player implementation for Flutter.

## Getting Started

* Download you animated project for flutter from [SVGator](https://app.svgator.com/) (using `External` player option)
* Copy the `.dart` file into your project (into your main `lib` directory or into a subdirectory)
* import the file (both `class` & `state` for API usage)

## Size

Unless sizes are specified as a parameter, the animated SVG component will fill in the available space. Under some circumstances though, if the component is loaded in a scrollable container (i.e. `ListView`) one might be needed to provide a `height` parameter.

## Usage

Find an example below of SVGator animation implemented in flutter.

Please note that `Test-Robot.dart` should be the file exported from [SVGator](https://app.svgator.com/).
Pass your callback in the `onMessage` property to SVGator's component to capture `Player Events` & call `SVGatorPlayer?.currentState?.runCommand(command, param)` to control the animation.

```dart
import './Test-Robot.dart' as SVGator show TestRobot, TestRobotState;

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  GlobalKey<SVGator.TestRobotState>? _SVGatorPlayer = GlobalKey<SVGator.TestRobotState>();

  void _eventListener([String? message]) {
    print("Message received: $message");
  }

  void _runCommand(String command, int? param) {
    _SVGatorPlayer?.currentState?.runCommand(command, param);
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Welcome to Flutter',
      home: Scaffold(
        appBar: AppBar(
          title: const Text('Welcome to Flutter'),
        ),
        body: Column(
          children: [
            Expanded(
                child: SVGator.TestRobot(
                  height: 310,
                  key: _SVGatorPlayer,
                  onMessage: _eventListener,
                ),

            )
          ],
        )
      ),
    );
  }
}

```

## Useful Links

For more information, check out the links below:
* [SVGator API - Flutter Test App](https://github.com/SVGator/Flutter-Player-API)
* [SVGator Player JS API Documentation](https://www.svgator.com/help/getting-started/svgator-player-js-api)
* [Animate Programmatically with SVGator](https://www.svgator.com/help/getting-started/animate-programmatically)
* [Export Flutter Animations with SVGator](https://www.svgator.com/help/getting-started/export-flutter-animations)

## Changelog
#### 3.0.0
* Dependency update
* Player API Support Extended with control for the following properties (through `set` method):
    * speed
    * fps
    * iterations
    * direction
    * alternate
    * fill mode
* Player API new properties:
    * player.direction
    * player.fill
    * player.fps
    * player.isBackwards
    * player.isInfinite
    * player.isReversed
    * player.speed
* Player API new methods:
    * player.togglePlay()
    * player.set(property, value)

#### 2.0.0
* Sizing & scaling issues fixed
* Player API Support Implemented:
    * Starting the animation programmatically
    * Capturing animation events
* Demo added to Readme

#### 1.0.4

* Improved gradient animators added

#### 1.0.3

* Dependency updated

#### 1.0.2

* Missing null-safety operator added

#### 1.0.1

* Dependency update

#### 1.0.0

* SVGator animation player for Flutter 


