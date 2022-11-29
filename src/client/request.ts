import {reactive} from 'vue';

const requestService = reactive({
  /**
   * Jwt token of the authorization header
   */
  jwtToken: null,
  /**
   * Sends a json request to the express backend and returns the
   * received json response.
   *
   * @param controller backend controller name
   * @param method controller's method name
   * @param params request params
   * @returns response
   */
  send: async (controller: string, method = '', params: object = {}): Promise<Response> => {
    const url = `${window.location.protocol}//${window.location.host}/api/${controller}/${method}`;
    const headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: requestService.jwtToken ? `Bearer ${requestService.jwtToken}` : '',
    });
    const options = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(params),
    };
    const request = new Request(url, options);
    return await fetch(request);
  },
});

export default requestService;
