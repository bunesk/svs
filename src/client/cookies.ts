import {useCookies} from '@vueuse/integrations/useCookies';

const cookies = useCookies();

const cookiesHandler = {
  /**
   * Returns the value of the cookie.
   *
   * @param name the cookie's name
   * @returns the cookie's value
   */
  get: (name: string): string => {
    return cookies.get(name) ?? '';
  },
  /**
   * Sets the value to the cookie.
   *
   * @param name the cookie's name
   * @param value the value to set
   * @param lifetime how long the cookie should be there (in seconds, default: 90 days)
   */
  set: (name: string, value: string, lifetime = 86400 * 90) => {
    const timestamp = new Date().getTime() + lifetime;
    const expireDate = new Date(timestamp);
    cookies.set(name, value, {expires: expireDate});
  },
  /**
   * Removes a cookie.
   *
   * @param name the cookie's name
   */
  remove: (name: string) => {
    cookies.remove(name);
  },
};

export default cookiesHandler;
