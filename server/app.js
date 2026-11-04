
// Funcion para manejar errores en la aplicacion
import createError from 'http-errors';

// Importar el framework Express
import express from 'express';

// Importar modulos para manejar rutas
import path, { dirname } from 'node:path';

// Importar modulos para manejar cookies
import cookieParser from 'cookie-parser';

// Importar modulos para manejar logs
import morgan from 'morgan';

// Imports para crear Dirname
import { fileURLToPath } from 'node:url';

// Importar las rutas de la aplicacion
import indexRouter from '#routes/index.js';
import usersRouter from '#routes/users.js';

// Importar la funcion de configuracion de Handlebars
import configureHandlebars from './lib/handlebars.js';

// Importar la configuracion de Winston Logger
import logger from './lib/winston.js';

// Creando las variables de rutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Crear la aplicacion Express
logger.info('🔨 Creando backend');
const app = express();

// Configurar el motor de vistas con Handlebars
configureHandlebars(app);

// Configurar middlewares de la aplicacion
app.use(
  morgan('dev', {
    stream: {
      write: (msg) => logger.info(msg.trim()),
    },
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Archivos estaticos para produccion
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'dist')));
}

// Configurar la carpeta de archivos estaticos
logger.info('🔨 Creando servidor de Archivos Estáticos');
app.use(express.static(path.join(__dirname, '..', 'public')));

// Registrar las rutas de la aplicacion
logger.info('🛣️ Registrando rutas');
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Capturar errores 404
app.use((req, res, next) => {
  next(createError(404));
});

// Manejador de errores
app.use((err, req, res, _next) => {
  // Establecer los datos locales
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Renderizar la pagina de error
  res.status(err.status || 500);
  res.render('error');
});

// Exportar la aplicacion
export default app;
