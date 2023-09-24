
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:tesla_android/common/utils/logger.dart';
import 'package:tesla_android/feature/display/model/remote_display_state.dart';
import 'package:tesla_android/feature/display/repository/display_repository.dart';
import 'package:tesla_android/feature/settings/bloc/display_configuration_state.dart';

@injectable
class DisplayConfigurationCubit extends Cubit<DisplayConfigurationState>
    with Logger {
  final DisplayRepository _repository;

  RemoteDisplayState? _currentConfig;

  DisplayConfigurationCubit(this._repository)
      : super(DisplayConfigurationStateInitial());

  void fetchConfiguration() async {
    if (!isClosed) emit(DisplayConfigurationStateLoading());
    try {
      _currentConfig = await _repository.getDisplayState();
      _emitCurrentConfig();
    } catch (exception, stacktrace) {
      logException(
        exception: exception,
        stackTrace: stacktrace,
      );
      if (!isClosed) {
        emit(
          DisplayConfigurationStateError(),
        );
      }
    }
  }

  void setResponsiveness(bool newSetting) async {
    var config = _currentConfig;
    final isResponsive = newSetting ? 1 : 0;
    if (config != null) {
      config = config.copyWith(isResponsive: isResponsive);
      if (!isClosed) emit(DisplayConfigurationStateSettingsUpdateInProgress());
      try {
        await _repository.updateDisplayConfiguration(config);
        _currentConfig = _currentConfig?.copyWith(isResponsive: isResponsive);
        _emitCurrentConfig();
        dispatchAnalyticsEvent(
          eventName: "display_configuration_set_responsiveness",
          props: {
            "isResponsive": newSetting,
          },
        );
      } catch (exception, stackTrace) {
        logExceptionAndUploadToSentry(
            exception: exception, stackTrace: stackTrace);
        if (!isClosed) emit(DisplayConfigurationStateError());
      }
    } else {
      log("_currentConfig not available");
    }
  }

  void setVariableRefresh(bool newSetting) async {
    var config = _currentConfig;
    final isVariableRefresh = newSetting ? 1 : 0;
    if (config != null) {
      config = config.copyWith(isVariableRefresh: isVariableRefresh);
      if (!isClosed) emit(DisplayConfigurationStateSettingsUpdateInProgress());
      try {
        await _repository.updateDisplayConfiguration(config);
        _currentConfig =
            _currentConfig?.copyWith(isVariableRefresh: isVariableRefresh);
        _emitCurrentConfig();
        dispatchAnalyticsEvent(
          eventName: "display_configuration_set_variable_refresh",
          props: {
            "isVariableRefresh": newSetting,
          },
        );
      } catch (exception, stackTrace) {
        logExceptionAndUploadToSentry(
            exception: exception, stackTrace: stackTrace);
        if (!isClosed) emit(DisplayConfigurationStateError());
      }
    } else {
      log("_currentConfig not available");
    }
  }

  void setResolution(DisplayResolutionModePreset newPreset) async {
    var config = _currentConfig;
    if (config != null) {
      config = config.updateResolution(newPreset: newPreset);
      if (!isClosed) emit(DisplayConfigurationStateSettingsUpdateInProgress());
      try {
        await _repository.updateDisplayConfiguration(config);
        _currentConfig = _currentConfig?.copyWith(lowRes: newPreset);
        _emitCurrentConfig();
        dispatchAnalyticsEvent(
          eventName: "display_configuration_set_resolution",
          props: {
            "newPreset": newPreset.name(),
          },
        );
      } catch (exception, stackTrace) {
        logExceptionAndUploadToSentry(
            exception: exception, stackTrace: stackTrace);
        if (!isClosed) emit(DisplayConfigurationStateError());
      }
    } else {
      log("_currentConfig not available");
    }
  }

  void setRenderer(DisplayRendererType newType) async {
    var config = _currentConfig;
    if (config != null) {
      config = config.updateRenderer(newType: newType);
      if (!isClosed) emit(DisplayConfigurationStateSettingsUpdateInProgress());
      try {
        await _repository.updateDisplayConfiguration(config);
        _currentConfig = _currentConfig?.copyWith(renderer: newType);
        _emitCurrentConfig();
        dispatchAnalyticsEvent(
          eventName: "display_configuration_set_renderer",
          props: {
            "newType": newType.name(),
          },
        );
      } catch (exception, stackTrace) {
        logExceptionAndUploadToSentry(
            exception: exception, stackTrace: stackTrace);
        if (!isClosed) emit(DisplayConfigurationStateError());
      }
    } else {
      log("_currentConfig not available");
    }
  }

  void setVulkanState(bool isEnabled) async {
    var config = _currentConfig;
    if (config != null) {
      config = config.updateVulkanState(isEnabled: isEnabled);
      if (!isClosed) emit(DisplayConfigurationStateSettingsUpdateInProgress());
      try {
        await _repository.updateVulkanState(isEnabled);
        _currentConfig = _currentConfig?.copyWith(
          useVulkan: isEnabled ? "true" : "false",
        );
        _emitCurrentConfig();
        dispatchAnalyticsEvent(
          eventName: "display_configuration_set_vulkan_state",
          props: {
            "isEnabled": _currentConfig?.useVulkan,
          },
        );
      } catch (exception, stackTrace) {
        logExceptionAndUploadToSentry(
            exception: exception, stackTrace: stackTrace);
        if (!isClosed) emit(DisplayConfigurationStateError());
      }
    } else {
      log("_currentConfig not available");
    }
  }

  void _emitCurrentConfig() {
    if (!isClosed) {
      emit(DisplayConfigurationStateSettingsFetched(
        lowResModePreset: _currentConfig!.lowRes,
        renderer: _currentConfig!.renderer,
        isResponsive: _currentConfig!.isResponsive == 1,
        isVariableRefresh: _currentConfig!.isVariableRefresh == 1,
        useVulkan: _currentConfig!.useVulkan == "true",
      ));
    }
  }
}
