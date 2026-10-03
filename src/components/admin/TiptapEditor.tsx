// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Heading2,
  Quote,
  Undo2,
  Redo2,
} from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import toast from "react-hot-toast";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const ToolbarButton: React.FC<{
  active?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
}> = ({ active, onClick, title, children, disabled }) => (
  <button
    type="button"
    title={title}
    aria-label={title}
    aria-pressed={!!active}
    disabled={disabled}
    onClick={onClick}
    className={`p-2 rounded-md transition-colors disabled:opacity-40 ${
      active
        ? "bg-primary text-white"
        : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
    }`}
  >
    {children}
  </button>
);

const TiptapEditor: React.FC<TiptapEditorProps> = ({ content, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const BASE = (import.meta.env.VITE_NODE_BACKEND_URL as string) || "";

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: { class: "max-w-full h-auto rounded-lg my-4" },
      }),
      Link.configure({ openOnClick: false }),
      Underline,
      Placeholder.configure({ placeholder: "اكتب محتوى المقال هنا..." }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content,
    editorProps: {
      attributes: {
        class: "blog-content focus:outline-none",
        dir: "rtl",
      },
    },
    onUpdate: ({ editor: instance }) => {
      onChange(instance.getHTML());
    },
  });

  // Keep the editor in sync when the parent resets the content (e.g. new post).
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  const uploadImage = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("يرجى اختيار ملف صورة");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch(`${BASE}/admin/posts/upload-image`, {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      const result = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(result?.message || `HTTP ${res.status}`);
      }
      editor
        ?.chain()
        .focus()
        .setImage({ src: getImageUrl(result.url || result.path) })
        .run();
    } catch (err: any) {
      toast.error(err?.message || "فشل رفع الصورة");
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadImage(file);
    e.target.value = "";
  };

  const setLink = () => {
    if (!editor) return;
    const previous = editor.getAttributes("link").href || "";
    const url = window.prompt("أدخل الرابط", previous);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  if (!editor) return null;

  return (
    <div className="border rounded-md bg-white dark:bg-gray-900 overflow-hidden">
      <div className="border-b border-black/10 dark:border-white/10 p-2 flex flex-wrap gap-1 items-center">
        <ToolbarButton
          title="عناوين فرعية"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>

        <span className="w-px h-5 bg-black/10 dark:bg-white/10 mx-1" />

        <ToolbarButton
          title="غامق"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="مائل"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="تحته خط"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>

        <span className="w-px h-5 bg-black/10 dark:bg-white/10 mx-1" />

        <ToolbarButton
          title="قائمة نقطية"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="قائمة مرقمة"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="اقتباس"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>

        <span className="w-px h-5 bg-black/10 dark:bg-white/10 mx-1" />

        <ToolbarButton
          title="محاذاة لليمين"
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="توسيط"
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="محاذاة لليسار"
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>

        <span className="w-px h-5 bg-black/10 dark:bg-white/10 mx-1" />

        <ToolbarButton title="إضافة رابط" active={editor.isActive("link")} onClick={setLink}>
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="رفع صورة"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? (
            <span className="text-xs px-1">جارٍ الرفع...</span>
          ) : (
            <ImageIcon className="h-4 w-4" />
          )}
        </ToolbarButton>

        <span className="w-px h-5 bg-black/10 dark:bg-white/10 mx-1" />

        <ToolbarButton
          title="تراجع"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="إعادة"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo2 className="h-4 w-4" />
        </ToolbarButton>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      <div className="tiptap-surface p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TiptapEditor;