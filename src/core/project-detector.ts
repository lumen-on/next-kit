import path from 'path';
import { pathExists } from './file-system.js';

export interface ProjectStructure {
  hasSrcDir: boolean;
  hasAppDir: boolean;
  hasPagesDir: boolean;
  hasComponentsDir: boolean;
  rootDir: string;
  componentDir: string;
  apiDir: string;
  hookDir: string;
}

export async function detectProjectStructure(cwd: string = process.cwd()): Promise<ProjectStructure> {
  const hasSrcDir = await pathExists(path.join(cwd, 'src'));
  const hasAppDir = await pathExists(path.join(cwd, hasSrcDir ? 'src/app' : 'app'));
  const hasPagesDir = await pathExists(path.join(cwd, hasSrcDir ? 'src/pages' : 'pages'));
  const hasComponentsDir = await pathExists(path.join(cwd, hasSrcDir ? 'src/components' : 'components'));

  const rootDir = hasSrcDir ? 'src' : '.';
  const componentDir = hasComponentsDir 
    ? path.join(rootDir, 'components') 
    : path.join(rootDir, 'components');

  const apiDir = hasAppDir 
    ? path.join(rootDir, 'app/api')
    : path.join(rootDir, 'pages/api');

  const hookDir = path.join(rootDir, 'hooks');

  return {
    hasSrcDir,
    hasAppDir,
    hasPagesDir,
    hasComponentsDir,
    rootDir,
    componentDir,
    apiDir,
    hookDir,
  };
}

export function resolveComponentPath(structure: ProjectStructure, name: string): string {
  return path.join(structure.componentDir, name);
}

export function resolveApiPath(structure: ProjectStructure, name: string): string {
  return path.join(structure.apiDir, name);
}

export function resolveHookPath(structure: ProjectStructure, name: string): string {
  return path.join(structure.hookDir, name);
}
