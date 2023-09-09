import 'package:dio/dio.dart' hide Headers;
import 'package:flavor/flavor.dart';
import 'package:injectable/injectable.dart';
import 'package:retrofit/retrofit.dart';
import 'package:tesla_android/feature/connectivityCheck/model/health_state.dart';

part 'health_service.g.dart';

@injectable
@RestApi()
abstract class HealthService {
  @factoryMethod
  factory HealthService(
      Dio dio,
      Flavor flavor,
      ) =>
      _HealthService(
        dio,
        baseUrl: flavor.getString("configurationApiBaseUrl"),
      );

  @GET("/health")
  @DioResponseType(ResponseType.json)
  Future<HealthState> getHealthCheck();
}
