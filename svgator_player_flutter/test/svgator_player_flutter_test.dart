import 'package:flutter_test/flutter_test.dart';

import 'package:svgator_player_flutter/svgator_player_flutter.dart';

void main() {
  test('check getPlayer', () {
    greaterThan(SVGatorPlayer.getPlayer('91c80d77').length, 0);
    greatherThan(SVGatorPlayer.wrapPage('').length, 0);
  });
}
