# svgator_player_flutter

SVGator's animation player implementation for Flutter

## Getting Started

Download you animated project for flutter from [app.svgator.com](https://app.svgator.com/) and import it into the file where you are willing to use it.

## Usage
Example of using an SVGator animation that uses flutter player.

Note that the module will be included inside MyAnimation.dart (that is generated automatically by app.svgator.com)
```dart
import './Animations/MyAdmination.dart' as SVGator show MyAdmination;
void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  final _expandedKey = UniqueKey();

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Welcome to Flutter',
      home: Scaffold(
        appBar: AppBar(
          title: const Text('Welcome to Flutter'),
        ),
        body: Column(
          children: [
            Expanded(
                key: _expandedKey,
                child: SVGator.MyAdmination()
            )
          ],
        )
      ),
    );
  }
}

```
