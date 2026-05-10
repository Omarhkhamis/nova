"use client";

import { useMemo, useState } from "react";
import { createEditor, Descendant } from "slate";
import { Editable, Slate, withReact } from "slate-react";

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "Write the blog article content here." }],
  } as Descendant,
];

export function SlateBlogEditor({ defaultValue = initialValue }: { defaultValue?: Descendant[] }) {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Descendant[]>(defaultValue);

  return (
    <div className="slate-editor">
      <input type="hidden" name="content_json" value={JSON.stringify(value)} />
      <Slate editor={editor} initialValue={defaultValue} onChange={(nextValue) => setValue(nextValue)}>
        <Editable className="slate-editor__surface" placeholder="Write blog content..." />
      </Slate>
    </div>
  );
}
