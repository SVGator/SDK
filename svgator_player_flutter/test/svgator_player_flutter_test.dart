import 'package:flutter_test/flutter_test.dart';

import 'package:svgator_player_flutter/svgator_player_flutter.dart';

void main() {
  test('check getPlayer', () {
    expect(SVGatorPlayer.getPlayer('91c80d77').length, greaterThan(0));
    expect(SVGatorPlayer.wrapPage('').length, greaterThan(0));
  });
}
