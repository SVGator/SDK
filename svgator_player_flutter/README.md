# svgator_player_flutter

SVGator's animation player implementation for Flutter.

## Getting Started

Download you animated project for flutter from [app.svgator.com](https://app.svgator.com/) and import it into the project where you are willing to use it.

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
* [SVGator Player JS API Documentation](https://www.svgator.com/help/getting-started/svgator-player-js-api)
* [Animate Programatically with SVGator](https://www.svgator.com/help/getting-started/animate-programmatically)
* [SVGator API - Flutter Implementation]() 


