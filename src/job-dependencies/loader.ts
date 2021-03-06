import * as fs from 'fs';
import * as path from 'path';

export function fillDependencies(jobWorker: any, deps: any): void {
  jobWorker.dependencies = {};

  const dependencyFolders = fs.readdirSync(__dirname);

  for (let i = dependencyFolders.length - 1; i >= 0; i -= 1) {
    const folderPath = path.join(__dirname, dependencyFolders[i]);
    const stat = fs.statSync(folderPath);
    if (stat.isDirectory()) {
      try {
        const depPath = path.join(folderPath, 'dependency.js');
        jobWorker.dependencies[dependencyFolders[i]] = require(depPath).default(jobWorker, deps);
      } catch (error) {
        // tslint:disable-next-line max-line-length
        throw Error(`\nError resolving dependency: ${dependencyFolders[i]}\nDependencies required: ${path.join(folderPath, 'dependency.js')}\nStack trace: ${error}`);
      }
    }
  }
}
