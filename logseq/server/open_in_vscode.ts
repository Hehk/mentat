// Opens a page in vscode
// TODO make it work with journals
import * as fs from "fs"
import path from "path"
import { spawn, cwd } from "bun"

const readDir = (path: string): Promise<string[]> => {
  return new Promise<string[]>((resolve, reject) => {
    fs.readdir(path, (err: Error, files: string[]) => {
      if (err) return reject(err)
      resolve(files)
    })
  })
}

export default async function openInVsCode({ name }: { name: string }) {
  const regex = new RegExp(`^${name.replace("/", ".")}.md$`)
  const notesDir = path.resolve(path.resolve(cwd, "../../../Notes/pages"))
  const pages = await readDir(notesDir)
  const page = pages.find((filename) => regex.test(filename))

  const file = path.join(notesDir, page)
  spawn(["code", file])

  return {}
}
