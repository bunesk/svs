## Controllers

Enter your controllers here as `.ts` files.
The naming convention is `{name}.controller.ts` which will be automatically loaded if the matching url is called. So i.e. `/api/user` will load the `user.controller.ts` file.

You need to insert an exported `index` function which will be executed if nothing or something invalid will be additionally added to the url.
You can add other exported functions which will be automatically called if you add the name to the url. So i.e. `/api/user/get-name` will execute the `getName` function in `user.controller.ts`.

All functions receive an express request and an express response object. They should always all the functions `sendJsonSuccess` and `sendJsonError` from `../server/json.js` to send a json response for the request.

### Example content

```ts
import {Request} from 'express-jwt';
import {Response} from 'express';
import {sendJsonError, sendJsonSuccess} from '../server/json.js';

export const index = (req: Request, res: Response) => {
  return sendJsonSuccess(res, {title: 'index'});
};

export const getName = (req: Request, res: Response) => {
  return sendJsonSuccess(res, {title: 'getName'});
};
```
