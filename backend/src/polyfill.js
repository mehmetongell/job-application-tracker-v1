import { Blob, File } from 'node:buffer';

if (!global.File) {
  global.File = File;
}
if (!global.Blob) {
  global.Blob = Blob;
}