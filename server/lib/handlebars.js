
import { engine } from 'express-handlebars';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configureHandlebars = (app) => {
  app.engine(
    'hbs',
    engine({
      extname: '.hbs',
      defaultLayout: 'main',
      layoutsDir: path.join(__dirname, '..', 'views', 'layouts'),
    }),
  );

  app.set('views', path.join(__dirname, '..', 'views'));
  app.set('view engine', 'hbs');
};

export default configureHandlebars;
