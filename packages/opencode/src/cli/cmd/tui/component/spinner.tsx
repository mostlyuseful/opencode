import { createEffect, createSignal, Show } from "solid-js"
import { useTheme } from "../context/theme"
import { useKV } from "../context/kv"
import type { JSX } from "@opentui/solid"
import type { RGBA } from "@opentui/core"

const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]

export function Spinner(props: { children?: JSX.Element; color?: RGBA; frames?: string[]; interval?: number }) {
  const { theme } = useTheme()
  const kv = useKV()
  const color = () => props.color ?? theme.textMuted
  const list = () => props.frames ?? frames
  const [idx, setIdx] = createSignal(0)

  createEffect(() => {
    if (!kv.get("animations_enabled", true)) return
    const timer = setInterval(() => {
      setIdx((x) => (x + 1) % Math.max(1, list().length))
    }, props.interval ?? 80)
    return () => clearInterval(timer)
  })

  return (
    <Show when={kv.get("animations_enabled", true)} fallback={<text fg={color()}>⋯ {props.children}</text>}>
      <box flexDirection="row" gap={1}>
        <text fg={color()}>{list()[idx()] ?? "⋯"}</text>
        <Show when={props.children}>
          <text fg={color()}>{props.children}</text>
        </Show>
      </box>
    </Show>
  )
}
