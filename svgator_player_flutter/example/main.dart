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
  final String _documentationUrl =
      'https://www.svgator.com/help/getting-started/svgator-player-js-api';
  final GlobalKey<EventLogState> _eventLog = GlobalKey();
  final GlobalKey<svgator.ExternalDemoState> _svgatorPlayer =
      GlobalKey<svgator.ExternalDemoState>();

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
      )),
    );
  }
}
