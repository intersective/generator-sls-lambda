import { Request, Response } from 'express';
import { Log } from '../utils';

function dashboard(req: Request, res: Response) {
  Log.debug('Request received', { req });
  res.status(200).send({
    message: 'success',
  });
}

export default dashboard;
