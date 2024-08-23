import * as fs from 'node:fs';
import * as fsPromises from 'node:fs/promises';
import * as path from 'node:path';

import { Injectable } from '@nestjs/common';
import Handlebars from 'handlebars';

@Injectable()
export class TemplateService {
  private readonly templateDir: string;

  constructor() {
    this.templateDir = path.join(__dirname, '..', '..', 'templates');
  }

  async load(name: string, context: any) {
    const templatePath = path.join(this.templateDir, name + '.hbs');

    if (!fs.existsSync(templatePath)) {
      return null;
    }

    const content = await fsPromises.readFile(templatePath, 'utf-8');
    const template = Handlebars.compile(content);

    return template(context);
  }
}
