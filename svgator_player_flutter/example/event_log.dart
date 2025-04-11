import 'package:flutter/material.dart';

class EventLog extends StatefulWidget {
  const EventLog({super.key});

  @override
  State<EventLog> createState() => EventLogState();
}

class EventLogState extends State<EventLog> {
  String? _event;
  int? _offset;

  void updateLog(String event, int offset) {
    setState(() {
      _event = event;
      _offset = offset;
    });
  }

  static const TextStyle logStyle = TextStyle(
    color: Colors.grey,
    fontFamily: 'space-mono',
    fontSize: 14,
    fontFeatures: [FontFeature.tabularFigures()],
  );

  static const TextStyle highlightStyle = TextStyle(
    color: Colors.white,
    fontFamily: 'space-mono',
    fontSize: 14,
    fontFeatures: [FontFeature.tabularFigures()],
  );

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        borderRadius: BorderRadius.all(Radius.circular(10)),
        color: Color(0x552D2D2D),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 20),

      child: Row(
        children:
        _event == null
            ? <Widget>[
          const Text('> Log events will show up here.', style: logStyle),
        ]
            : <Widget>[
          const Text('> ', style: logStyle),
          Text('$_event', style: highlightStyle),
          const Text(' event occurred at offset ', style: logStyle),
          Text('$_offset', style: highlightStyle),
          const Text('.', style: logStyle),
        ],
      ),
    );
  }
}
