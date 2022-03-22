import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import 'dart:convert';

import './Parts.dart';
import './EventLog.dart';
import './MediaButtons.dart';

import './Test-Robot.dart' as SVGator show TestRobot, TestRobotState;

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SVGator - Mobile Player API',
      theme: ThemeData(
        primarySwatch: MaterialColor(svgatorBlue, svgatorBlueMaterial),
      ),
      home: const MyHomePage(title: 'SVGator - Mobile Player API'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({Key? key, required this.title}) : super(key: key);
  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  final String _url = 'https://www.svgator.com/help/getting-started/svgator-player-js-api';
  GlobalKey<EventLogState> _eventLog = GlobalKey();
  GlobalKey<SVGator.TestRobotState>? _SVGatorPlayer = GlobalKey<SVGator.TestRobotState>();

  void _eventListener([String? message]) {
    final data = jsonDecode(message ?? '{}');
    _eventLog.currentState?.updateLog(data['event'] ?? '', data['offset']);
  }

  void _runCommand(String command, int? param) {
    _SVGatorPlayer?.currentState?.runCommand(command, param);
  }

  void _launchURL() async {
    if (!await launch(_url)) throw 'Could not launch $_url';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body:
        Center(
          child: ListView(
              padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
              children: <Widget>[
                logo(),
                logTitle('Svgator Player API - Event Log:', context),
                EventLog(
                  key: _eventLog,
                ),
                SVGator.TestRobot(
                  height: 310,
                  key: _SVGatorPlayer,
                  onMessage: _eventListener,
                ),
                MediaButtons(
                  parentAction: _runCommand,
                ),
                TextButton(
                  onPressed: _launchURL,
                  child: const Text(
                      "Tap here to see SVGator's Full API documentation.",
                      style: TextStyle(
                          color: Color(0xFF2f95dc),
                          fontFamily: 'space-mono',
                          fontSize: 14,
                      ),
                  ),
                ),
              ],
          )
        ),
    );
  }
}
