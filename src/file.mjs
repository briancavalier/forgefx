export function * readFile (path, encoding) {
  return yield ({ effect: 'File', op: 'readFile', args: [path, encoding] })
}
