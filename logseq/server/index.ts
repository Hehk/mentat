import openInVsCode from "./open_in_vscode"
import { port } from "../config"

export default {
  port,
  async fetch(request: Request) {
    const url = new URL(request.url)
    const method = request.method
    const match = (pattern: RegExp, requestMethod: string) => {
      return url.pathname.match(pattern) && method === requestMethod
    }

    let value
    switch (true) {
      case match(/^\/open_in_vscode$/, "POST"):
        value = openInVsCode(await request.json())
        break
    }

    if (value) {
      return new Response(JSON.stringify(value))
    } else {
      return new Response("Hoi!")
    }
  },
}
