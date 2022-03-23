import 'dart:ui';
import 'package:flutter/material.dart';

class MediaButtons extends StatelessWidget {
  final parentAction;
  const MediaButtons({Key? key, this.parentAction}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
        children: <Widget>[
          Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                _getMediaButton(parentAction, 'play'),
                _getMediaButton(parentAction, 'pause'),
                _getMediaButton(parentAction, 'stop'),
                _getMediaButton(parentAction, 'reverse'),
                _getMediaButton(parentAction, 'toggle'),
              ]),
          Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                _getMediaButton(parentAction, 'seekBy', 'Seek -0.5s', -500),
                _getMediaButton(parentAction, 'seek', 'Seek 50%', 50),
                _getMediaButton(parentAction, 'seekBy', 'Seek +0.5s', 500),
                _getMediaButton(parentAction, 'restart'),
                _getMediaButton(parentAction, 'destruct'),
              ]),
        ]
    );
  }
}

const _icons = {
  'play': Icons.play_arrow_rounded,
  'pause': Icons.pause_rounded,
  'stop': Icons.stop_rounded,
  'reverse': Icons.swap_horiz_rounded, // arrow_left_rounded
  'toggle': Icons.toggle_on_rounded,
  'Seek -0.5s': Icons.arrow_back_rounded,
  'Seek 50%': Icons.star_half_rounded,
  'Seek +0.5s': Icons.arrow_forward_rounded,
  'restart': Icons.restart_alt_rounded,
  'destruct': Icons.eject_rounded,
};

Widget _getMediaButton(Function callback, String command, [String? display = null, int? param = null]) {
  return Container(
    margin: const EdgeInsets.all(3),
    padding: const EdgeInsets.all(3),
    child:
    Column(
        children: <Widget>[
          IconButton(
            icon: Icon(_icons[display ?? command]),
            tooltip: display ?? command,
            onPressed: () {
              callback(command, param);
            },
          ),
          Text('${display ?? command}'),
        ]
    ),
  );
}
