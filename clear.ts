import rimraf = require('rimraf')
import fs = require('fs')
import path = require('path')

rimraf.sync('dist')

const ignore: string[] = ['node_modules', '.git', 'src', 'public']

removeJS(__dirname)

function removeJS (path: string): void {
  const elems: string[] = fs.readdirSync(path)

  for (let elem of elems) {
    const name = `${path}/${elem}`

    if (fs.statSync(name).isDirectory()) {
      if (ignore.indexOf(elem) === -1) {
        removeJS(name)
      }
    } else if (elem.split('.').pop() === 'js') {
      fs.unlinkSync(name)
    }
  }
}
