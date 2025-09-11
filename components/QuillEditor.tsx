"use client";

import dynamic from "next/dynamic";
import { forwardRef, useMemo, useRef } from "react";
import "react-quill-new/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

// react-quill 은 form 안에 직접 value 를 넣어주지 않음.
// 따라서 숨겨진 <input type="hidden"> 을 두고,
// react-quill 의 내용을 그 안에 채워넣어야 서버 액션에서 읽을 수 있다.

interface QuillEditorProps {
    className?: string;
    name: string;
    theme: string;
    style?: any;
    value?: string;
    isReadOnly: boolean;
    placeholder?: string;
    onChange?: (value: string) => void;
    onFocus?: (range: any, source: any, editor: any) => void;
}

function QuillEditor({
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

    const quillRef = useRef<any>(null);

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
        [],
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
                // ref={quillRef as any}
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