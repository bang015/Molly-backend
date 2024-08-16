import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import methodOverride from 'method-override';
import { errors } from 'celebrate';
import morgan from 'morgan';
import config from '../config';
import routes from '../routes';

export default ({ app }: { app: Application }) => {
  app.get('/', (req: Request, res: Response) => {
    res.send('Hello Molly');
    console.log('hi');
  });
  const corsOptions = {
    origin: `${process.env.REQ_ADDRESS}`,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  };
  app.use(cors(corsOptions));

  /* FOR USE RESTful API */
  app.use(methodOverride());

  /* Morgan Request Logger */
  app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

  /* REQUEST DATA */
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: false,
    }),
  );

  // 캐시 헤더 설정
  app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    next();
  });

  /* ROUTER */
  app.use(config.api.prefix, routes);

  /* Celebrate error */
  app.use(errors());

  /* catch 404 and forward to error handler */
  app.use((req: Request, res: Response, next: NextFunction) => {
    const err: any = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  /* error handler */
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({
      message: err.message,
      error: err,
    });
  });
};
