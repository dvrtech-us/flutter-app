import 'dart:convert';
import 'dart:html';

class Util {
  void sendJSCommand(String command, dynamic data) {
    window.postMessage(
        jsonEncode(
            {"type": "flutterCommand", "command": command, "data": data}),
        '*');
  }
}
