import React, { useState, useRef, useMemo } from "react";
import JoditEditor from "jodit-react";
import { Button } from "@mui/material";
// import "@jodit/react/jodit.css";

function TextEditor({ placeholder, editorContent, setEditorContent }) {
  const editor = useRef(null);

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || "Start typings...",
      height: "300px",
      autofocus: true,
    }),
    [placeholder]
  );

  return (
    <>
      <JoditEditor
        ref={editor}
        value={editorContent}
        config={config}
        tabIndex={1}
        onBlur={(newContent) => setEditorContent(newContent)}
        // onChange={(newContent) => {
        //   console.log("TextEditor - newContent:", newContent);
        //   setContent(newContent);
        // }}
      />
    </>
  );
}
TextEditor.defaultProps = {
  placeholder: "Write you blog",
};
export default TextEditor;
