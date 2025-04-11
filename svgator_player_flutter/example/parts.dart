import 'package:flutter/material.dart';

const int svgatorBlue  = 0xFF020818;

Map<int, Color> svgatorBlueMaterial = {
  50: Color.fromRGBO(0x02, 0x08, 0x18, .1),
  100: Color.fromRGBO(0x02, 0x08, 0x18, .2),
  200: Color.fromRGBO(0x02, 0x08, 0x18, .3),
  300: Color.fromRGBO(0x02, 0x08, 0x18, .4),
  400: Color.fromRGBO(0x02, 0x08, 0x18, .5),
  500: Color.fromRGBO(0x02, 0x08, 0x18, .6),
  600: Color.fromRGBO(0x02, 0x08, 0x18, .7),
  700: Color.fromRGBO(0x02, 0x08, 0x18, .8),
  800: Color.fromRGBO(0x02, 0x08, 0x18, .9),
  900: Color.fromRGBO(0x02, 0x08, 0x18, 1),
};

Widget logo() {
  return Container(
    decoration: const BoxDecoration(
      borderRadius: BorderRadius.all(Radius.circular(10)),
      color: Color(svgatorBlue),
    ),
    height: 70,
    margin: const EdgeInsets.symmetric(vertical: 10, horizontal: 10),
    padding: const EdgeInsets.symmetric(horizontal: 100),
    child: Image.asset('assets/images/SVGator-logo.png'),
  );
}

Widget logTitle(String content, BuildContext context) {
  return Container(
    margin: const EdgeInsets.all(8),
    child: Text(
      content,
      textAlign: TextAlign.center,
      style: TextStyle(
        color: Colors.white,
        fontSize: 17,
      ),
    ),
  );
}
