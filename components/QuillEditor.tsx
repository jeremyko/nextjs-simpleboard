"use client";

import dynamic from "next/dynamic";
import { forwardRef, useMemo, } from "react";
import "react-quill-new/dist/quill.snow.css";
// const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
// import ReactQuill from "react-quill-new";

// react-quill 은 form 안에 직접 value 를 넣어주지 않음.
// 따라서 숨겨진 <input type="hidden"> 을 두고,
// react-quill 의 내용을 그 안에 채워넣어야 서버 액션에서 읽을 수 있다.

const QuillDynamic = dynamic(() => import("react-quill-new"), {
    ssr: false,
});

import type ReactQuillType from "react-quill-new";

type ReactQuillInstanceRef = InstanceType<typeof ReactQuillType>;
type ReactQuillProps = React.ComponentProps<typeof ReactQuillType>;
// ref 를 전달하기 위해 forwardRef 사용
const ReactQuill = forwardRef<ReactQuillInstanceRef, ReactQuillProps>((props, ref) => (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <QuillDynamic {...(props as any)} ref={ref as any} />
));
ReactQuill.displayName = "ReactQuill";


interface QuillEditorProps {
    ref?: React.Ref<ReactQuillInstanceRef>;
    className?: string;
    name: string;
    theme: string;
    style?: React.CSSProperties;
    value?: string;
    isReadOnly: boolean;
    placeholder?: string;
    onChange?: (value: string) => void;
    // onFocus?: (selection: Range, source: EmitterSource, editor: UnprivilegedEditor) => void;
    onFocus?: () => void;
}

function QuillEditor({
    ref,
    className,
    name,
    theme,
    style,
    value,
    isReadOnly = false,
    placeholder,
    onChange,
    onFocus,
}: QuillEditorProps) {

    const modules = useMemo(
        () => ({
            toolbar:
                isReadOnly === false
                    ? [
                          [
                              { header: [1, 2, 3, 4, 5, false] },
                              // { font: [] }
                          ],
                          [{ size: [] }],
                          ["bold", "italic", "underline", "strike", "blockquote"],
                          [{ color: [] }, { background: [] }],
                          [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                          ["link", "image", "code", "code-block", "video"],
                          ["clean"],
                      ]
                    : false,
            clipboard: {
                // toggle to add extra line breaks when pasting HTML:
                matchVisual: false,
            },
        }),
        [isReadOnly],
    );

    // See https://quilljs.com/docs/formats/
    // const formats = [
    //     "header",
    //     "font",
    //     "size",
    //     "bold",
    //     "italic",
    //     "underline",
    //     "strike",
    //     "blockquote",
    //     "list",
    //     "indent",
    //     "link",
    //     "color",
    //     "image",
    //     "code",
    //     "code-block",
    //     "video",
    // ];

    return (
        <>
            <ReactQuill
                ref={ref}
                className={className}
                style={style}
                modules={modules}
                // formats={formats}
                theme={theme}
                value={value}
                onChange={onChange}
                onFocus={onFocus}
                placeholder={placeholder}
                readOnly={isReadOnly}
            />
            <input type="hidden" name={name} value={value} />
        </>
    );
}
export default QuillEditor;