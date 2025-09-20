"use client";

import dynamic from "next/dynamic";
import { forwardRef, useEffect, useMemo} from "react";
import "react-quill-new/dist/quill.snow.css";

// react-quill 은 form 안에 직접 value 를 넣어주지 않음.
// 따라서 숨겨진 <input type="hidden"> 을 두고,
// react-quill 의 내용을 그 안에 채워넣어야 서버 액션에서 읽을 수 있다.

//------------------------------------------------------------------------------
// document is not defined 오류 방지
const QuillDynamic = dynamic(() => import("react-quill-new"), {
    ssr: false,
}); 

//------------------------------------------------------------------------------
// form 제출 시 업로드 대기 중인(blob url을 가진) 파일 정보
// form 제출이 외부에서 관리되므로 여기서 export
export type PendingFile = { file: File; placeholderUrl: string };

//------------------------------------------------------------------------------
// ref 를 전달하기 위해 forwardRef 사용
import type ReactQuillType from "react-quill-new";
type ReactQuillInstanceRef = InstanceType<typeof ReactQuillType>;
type ReactQuillProps = React.ComponentProps<typeof ReactQuillType>;
const ReactQuill = forwardRef<ReactQuillInstanceRef, ReactQuillProps>((props, ref) => (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <QuillDynamic {...(props as any)} ref={ref as any} />
));
ReactQuill.displayName = "ReactQuill";

//------------------------------------------------------------------------------
interface QuillEditorProps {
    ref?: React.Ref<ReactQuillInstanceRef>;
    setPendingFiles?: React.Dispatch<React.SetStateAction<PendingFile[]>>;
    className?: string;
    name: string;
    theme: string;
    style?: React.CSSProperties;
    value?: string;
    isReadOnly: boolean;
    placeholder?: string;
    onChange?: (value: string) => void;
    onFocus?: () => void;
}

//------------------------------------------------------------------------------
function QuillEditor({
    ref, // image upload 위해 필요
    setPendingFiles,
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
    useEffect(() => {
        // sanitize 를 해줘야 quill 에서 이미지가 보임
        (async () => {
            const Quill = (await import("quill")).default;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const Image = Quill.import("formats/image") as any;
            Image.sanitize = function (url: string) {
                // blob URL 또는 supabase public URL만 허용
                if (url.startsWith("blob:") || url.includes("supabase.co/storage/v1/object/public/")) {
                    return url;
                }
                return "";
            };
        })();
    }, []);

    const handleImageInsert = async () => {
        // 저장 전, 이미지를 삽입할때마다 매번 호출됨.
        // console.debug("handleImageInsert called");
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.click();

        input.onchange = async () => {
            // console.debug("handleImageInsert onchange called");
            const file = input.files?.[0];
            if (!file) {
                console.error("No file selected");
                return;
            }
            // console.debug("file :", file);
            // 최종 저장 전까지는 blob URL 을 사용
            const blobUrl = URL.createObjectURL(file);
            // console.debug("blobUrl :", blobUrl);

            if (!ref || !("current" in ref) || !ref.current) {
                console.error("Quill editor ref is not available");
                return;
            }
            const quill = ref.current.getEditor();
            const sel = quill.getSelection?.(true);
            const index = sel?.index ?? quill.getLength?.() ?? 0;

            if (typeof index === "number") {
                quill.insertEmbed(index, "image", blobUrl);
                quill.setSelection(index + 1);
                if (setPendingFiles) {
                    setPendingFiles((prev) => [...prev, { file, placeholderUrl: blobUrl }]);
                }
            } else {
                console.error("Quill editor selection index is undefined");
            }
        };
    };

    // let modules = undefined;

    const toolbarOptions = {
        container: [
            [{ header: [1, 2, 3, 4, 5, false] }],
            [{ size: [] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ color: [] }, { background: [] }],
            [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
            ["link", "image", "code", "code-block", "video"],
            ["clean"],
        ],
        handlers: { image: handleImageInsert },
    };

    // addRange(): The given range isn't in document. 에러가 발생 => useMemo 사용 필요
    const modules = useMemo(() => {
        return {
            toolbar: isReadOnly === false ? toolbarOptions : false,
            clipboard: {
                // toggle to add extra line breaks when pasting HTML:
                matchVisual: false,
            },
        };
    }, []);

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