import 'dart:ui';
import 'package:flutter/material.dart';

class EventLog extends StatefulWidget {
  const EventLog({Key? key}) : super(key: key);
  @override
  State<EventLog> createState() => EventLogState();
}

class EventLogState extends State<EventLog> {
  String? _event;
  int? _offset;
  String? _wrapper = 'Event logs will show up here.';

  void updateLog(String event, int offset) {
    setState(() {
      _event = event;
      _offset = offset;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.all(Radius.circular(10)),
        color: Color(0xFF2D2D2D),
      ),
      margin: const EdgeInsets.symmetric(vertical: 10),
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 20),

      child: Row(
        children: _event == null
            ? <Widget>[
          const Text(
            '> Log events will show up here.',
            style: TextStyle(
                color: Color(0xAAFFFFFF),
                fontFamily: 'space-mono',
                fontSize: 14,
                fontFeatures: [
                  FontFeature.tabularFigures(),
                ]
            ),
          )
        ]
            : <Widget>[
          Text(
            '> ',
            style: TextStyle(
                color: Color(0xAAFFFFFF),
                fontFamily: 'space-mono',
                fontSize: 14,
                fontFeatures: [
                  FontFeature.tabularFigures(),
                ]
            ),
          ),
          Text(
            '${_event}',
            style: TextStyle(
                color: Color(0xFFFFFFFF),
                fontFamily: 'space-mono',
                fontSize: 14,
                fontFeatures: [
                  FontFeature.tabularFigures(),
                ]
            ),
          ),
          Text(
            ' event occured at offset ',
            style: TextStyle(
                color: Color(0xAAFFFFFF),
                fontFamily: 'space-mono',
                fontSize: 14,
                fontFeatures: [
                  FontFeature.tabularFigures(),
                ]
            ),
          ),
          Text(
            '$_offset',
            style: TextStyle(
                color: Color(0xFFFFFFFF),
                fontFamily: 'space-mono',
                fontSize: 14,
                fontFeatures: [
                  FontFeature.tabularFigures(),
                ]
            ),
          ),
          Text(
            '.',
            style: TextStyle(
                color: Color(0xAAFFFFFF),
                fontFamily: 'space-mono',
                fontSize: 14,
                fontFeatures: [
                  FontFeature.tabularFigures(),
                ]
            ),
          ),
        ],
      ),
    );
  }
}
