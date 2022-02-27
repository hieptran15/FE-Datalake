(function (window) {
  window.__env = window.__env || {};

  // API url
  //window.__env.apiUrl = 'http://10.60.170.188:8088/vbi-api/api';

  //window.__env.apiUrl = 'http://10.60.170.188:8088/vbi-api/api';
  //window.__env.apiUrlFe = 'http://10.60.170.188:8088/vbi-api';
  //window.__env.imageUrl = 'http://10.60.170.188:8088/vbi-api/api/application-images/show-image/';

  window.__env.apiUrl = 'http://localhost:8081/api';
  window.__env.apiUrlFe = 'http://localhost:8081';
  window.__env.imageUrl = 'http://localhost:8081/api/application-images/show-image/';
  window.__env.sso = 'https://sso2.viettel.vn:8001/sso/login?appCode=DWP&service=';
  window.__env.webportalURL = 'http://localhost:4201';


  // Whether or not to enable debug mode
  // Setting this to false will disable console output
  window.__env.enableDebug = true;

}(this));
