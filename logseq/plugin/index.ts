import "@logseq/libs"
import { port } from "../config"
import { googleAPIKey } from "../secrets"

async function translate(text: string, to: string, from: string) {
  const response = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${googleAPIKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        target: to,
        source: from,
      }),
    }
  )
  const json = await response.json()
  return json.data.translations.map((t) => t.translatedText)
}

async function fetchServer(path: string, json: unknown) {
  try {
    const response = await fetch(`http://localhost:${port}/${path}`, {
      method: "POST",
      body: JSON.stringify(json),
    })

    return await response.json()
  } catch (e) {
    throw e
  }
}

async function nlCard() {
  const currentBlock = await logseq.Editor.getCurrentBlock()
  if (!currentBlock) return

  const { content, uuid } = currentBlock
  const translations = await translate(content, "en", "nl")
  await logseq.Editor.updateBlock(
    uuid,
    `#card #nederland #bidirectional ${content}`
  )
  for (const translation of translations) {
    await logseq.Editor.insertBlock(uuid, translation)
  }
}

function main() {
  logseq.Editor.registerSlashCommand("nl card", nlCard)
  logseq.App.registerCommandShortcut(
    {
      mode: "non-editing",
      binding: "o c",
    },
    async () => {
      const page = await logseq.Editor.getCurrentPage()
      if (!page) return

      fetchServer("open_in_vscode", {
        name: page.originalName,
      })
    }
  )
}

// bootstrap
logseq.ready(main).catch(console.error)
