import 'package:flutter/material.dart';

class MediaButtons extends StatelessWidget {
  final void Function(String, int?, String?) parentAction;

  const MediaButtons({super.key, required this.parentAction});

  @override
  Widget build(BuildContext context) {
    return GridView.count(
      crossAxisCount: 5,
      shrinkWrap: true,
      physics: NeverScrollableScrollPhysics(),
      children: [
        _getMediaButton(parentAction, 'play', 'Play'),
        _getMediaButton(parentAction, 'pause', 'Pause'),
        _getMediaButton(parentAction, 'stop', 'Stop'),
        _getMediaButton(parentAction, 'reverse', 'Reverse'),
        _getMediaButton(parentAction, 'toggle', 'Toggle'),
        _getMediaButton(parentAction, 'seekBy', 'Seek -0.5s', -500),
        _getMediaButton(parentAction, 'seek', 'Seek 50%', 50),
        _getMediaButton(parentAction, 'seekBy', 'Seek +0.5s', 500),
        _getMediaButton(parentAction, 'restart', 'Restart'),
        _getMediaButton(parentAction, 'destruct', 'Destruct'),
      ],
    );
  }
}

const _icons = {
  'Play': Icons.play_arrow_rounded,
  'Pause': Icons.pause_rounded,
  'Stop': Icons.stop_rounded,
  'Reverse': Icons.swap_horiz_rounded,
  'Toggle': Icons.toggle_on_rounded,
  'Seek -0.5s': Icons.fast_rewind,
  'Seek 50%': Icons.star_half_rounded,
  'Seek +0.5s': Icons.fast_forward,
  'Restart': Icons.restart_alt_rounded,
  'Destruct': Icons.eject_rounded,
};

Widget _getMediaButton(Function callback, String command, [String? display, int? param,]) {
  const edgeInsets = EdgeInsets.all(0);

  return Container(
    margin: edgeInsets,
    padding: edgeInsets,
    child: InkWell(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Icon(
            _icons[display ?? command],
            size: 30,
            color: Colors.white,
          ),
          Text(
            display ?? command,
            style: TextStyle(color: Colors.white, fontSize: 12),
            softWrap: false,
            overflow: TextOverflow.visible,
          ),
        ],
      ),
      onTap: () {
        callback(command, param, '');
      },
    ),
  );
}
