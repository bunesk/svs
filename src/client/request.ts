import cookies from './cookies';

/**
 * Sends a json request to the express backend and returns the
 * received json response.
 *
 * @param controller backend controller name
 * @param method controller's method name
 * @param params request params
 * @returns response
 */
const sendRequest = async (controller: string, method = '', params: object = {}): Promise<Response> => {
  const jwtToken = cookies.get('auth');
  const url = `${window.location.protocol}//${window.location.host}/api/${controller}/${method}`;
  const headers = new Headers({
    Authorization: jwtToken ? 'Bearer ' + jwtToken : '',
    'Content-Type': 'application/json',
  });
  const options = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(params),
  };
  const request = new Request(url, options);
  return await fetch(request);
};

export default sendRequest;
