// ignore: avoid_web_libraries_in_flutter
import 'dart:html';

import 'package:flutter/material.dart';
import 'package:tesla_android/common/ui/constants/ta_dimens.dart';
import 'package:tesla_android/common/utils/logger.dart';

class TaAppBar extends StatelessWidget
    with Logger
    implements PreferredSizeWidget {
  final String? title;

  const TaAppBar({super.key, this.title});

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      automaticallyImplyLeading: false,
      centerTitle: false,
      title: Text(title ?? ''),
      actions: [
        OutlinedButton(
            onPressed: () {
              window.location.href = "/flutterless.html";
            },
            child: Text("Try MCU2 Light Mode")),
        SizedBox(
          width: 10,
        ),
        if (!(window.location.hostname?.contains("fullscreen") ?? false))
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: OutlinedButton(
              onPressed: () {
                Widget okButton = TextButton(
                  child: const Text("Understood"),
                  onPressed: () {
                    dispatchAnalyticsEvent(
                      eventName: "fullscreen_button_pressed",
                      props: {
                        "hostname": window.location.hostname,
                      },
                    );
                    window.location.href = "http://youtu.be:6969";
                  },
                );
                Widget cancelButton = TextButton(
                  child: const Text("Dismiss"),
                  onPressed: () {
                    Navigator.of(context).pop();
                  },
                );
                AlertDialog alert = AlertDialog(
                  title: const Text("Are you in Park?"),
                  content:
                      const Text("Full-Screen App is not available in Drive."),
                  actions: [okButton, cancelButton],
                );
                showDialog(
                  context: context,
                  builder: (BuildContext context) {
                    return alert;
                  },
                );
              },
              child: const Row(
                children: [
                  Text(
                    "Go Full-Screen",
                    style: TextStyle(fontWeight: FontWeight.bold, height: 1.15),
                  ),
                  SizedBox(
                    width: TADimens.PADDING_S_VALUE,
                  ),
                  Icon(
                    Icons.fullscreen,
                    size: 35,
                  ),
                ],
              ),
            ),
          )
      ],
    );
  }
}
