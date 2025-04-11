# svgator_player_flutter

SVGator's animation player implementation for Flutter.

## Getting Started

* Download your animated project for flutter from [SVGator](https://app.svgator.com/) (using `External` player option)
* Copy the `.dart` file into your project (into your main `lib` directory or into a subdirectory)
* import the file (both `class` & `state` for API usage)

## Size

Unless sizes are specified as a parameter, the animated SVG component will fill in the available space. Under some circumstances though, if the component is loaded in a scrollable container (i.e. `ListView`) one might be needed to provide a `height` parameter.

## Usage

Find an example below of SVGator animation implemented in flutter.

Please note that `External_Demo.dart` should be the file exported from [SVGator](https://app.svgator.com/).
Pass your callback in the `onMessage` property to SVGator's component to capture `Player Events` & call `SVGatorPlayer?.currentState?.runCommand(command, param, property)` to control the animation.

```dart
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import 'dart:convert';

import './parts.dart';
import './event_log.dart';
import './media_buttons.dart';

import './External_Demo.dart' as svgator show ExternalDemo, ExternalDemoState;

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SVGator - Mobile Player API',
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: Colors.black,
        colorScheme: ColorScheme.dark(primary: Colors.blueGrey),
      ),
      home: const MyHomePage(title: 'SVGator - Mobile Player API'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});
  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  final String _svgatorAboutUrl = 'https://www.svgator.com/about-us';
  final String _documentationUrl = 'https://www.svgator.com/help/getting-started/svgator-player-js-api';
  final GlobalKey<EventLogState> _eventLog = GlobalKey();
  final GlobalKey<svgator.ExternalDemoState> _svgatorPlayer = GlobalKey<svgator.ExternalDemoState>();

  void _eventListener([String? message]) {
    final data = jsonDecode(message ?? '{}');
    _eventLog.currentState?.updateLog(data['event'] ?? '', data['offset']);
  }

  void _runCommand(String command, int? param, String? property) {
    _svgatorPlayer.currentState?.runCommand(command, param, property);
  }

  void _launchDocumentationURL() async {
    if (!await launchUrl(Uri.parse(_documentationUrl))) {
      throw 'Could not launch $_documentationUrl';
    }
  }

  void _launchSvgatorAboutURL() async {
    if (!await launchUrl(Uri.parse(_svgatorAboutUrl))) {
      throw 'Could not launch $_svgatorAboutUrl';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Color(svgatorBlue),
        title: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              widget.title,
              style: TextStyle(color: Colors.white),
            ),
            IconButton(
              icon: Icon(Icons.info, color: Colors.white),
              onPressed: _launchSvgatorAboutURL,
            ),
          ],
        ),
      ),
      body: Center(
        child: ListView(
          padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
          children: <Widget>[
            logo(),
            logTitle('Svgator Player API - Event Log:', context),
            EventLog(
              key: _eventLog,
            ),
            svgator.ExternalDemo(
              height: 310,
              key: _svgatorPlayer,
              onMessage: _eventListener,
            ),
            MediaButtons(
              parentAction: _runCommand,
            ),
            TextButton(
              onPressed: _launchDocumentationURL,
              child: const Text(
                "Tap here to see SVGator's Full API documentation.",
                style: TextStyle(
                  color: Colors.white,
                  fontFamily: 'space-mono',
                  fontSize: 14,
                ),
              ),
            ),
          ],
        ),
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
#### 3.0.1
* Formatted code with `dart format .`
* Added dartdoc comments to document the code

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


