import {Request, Response} from 'express';

/**
 * Defines custom routing rules.
 *
 * @param app app
 */
const defineRules = (app: any) => {
  const rules = [{path: '/api', handler: apiHandler}];

  for (const rule of rules) {
    app.use(rule.path, rule.handler);
  }
};
export default defineRules;

const kebabToCamelCase = (str: string) =>
  str.replace(/-./g, (x) => x[1].toUpperCase());

// route 'api' urls to backend controllers
const apiHandler = async (req: Request, res: Response) => {
  const urlParts = req.originalUrl.split('/');
  const controllerUrl = urlParts[2];
  const controllerFunctionName = urlParts[3];
  if (!controllerUrl) {
    res.status(404).json({
      message: 'You must provide the controller name you want the data from.',
    });
    return;
  }
  try {
    const controller = await import(
      `../controllers/${controllerUrl}.controller.ts`
    );
    if (controllerFunctionName) {
      const controllerFunctionNameParsed = kebabToCamelCase(
        controllerFunctionName
      );
      if (controller[controllerFunctionNameParsed]) {
        controller[controllerFunctionNameParsed](req, res);
      } else {
        controller.index(req, res);
      }
    } else {
      controller.index(req, res);
    }
  } catch (e: any) {
    res.status(404).json({
      message: `Controller for ${controllerUrl} not found.`,
    });
  }
};
