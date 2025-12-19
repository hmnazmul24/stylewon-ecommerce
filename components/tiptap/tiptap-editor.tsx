"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Link from "@tiptap/extension-link";
import { BulletList, ListItem, OrderedList } from "@tiptap/extension-list";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold as BoldIcon,
  List as BulletIcon,
  Italic as ItalicIcon,
  Link as LinkIcon,
  ListOrdered as NumberIcon,
  Underline as UnderlineIcon,
} from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

interface MenuButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}

const MenuButton: React.FC<MenuButtonProps> = ({ active, onClick, icon }) => (
  <Button
    variant={active ? "default" : "outline"}
    className={`mr-1 flex h-9 w-9 items-center justify-center p-0 transition ${
      active ? "bg-primary text-primary-foreground" : ""
    }`}
    onClick={onClick}
    type="button"
  >
    {icon}
  </Button>
);

const urlSchema = z.object({
  url: z.url("Ouch. This is not a valid URL"),
});

export default function TiptapEditor({
  setText,
}: {
  setText: (text: string) => void;
}) {
  const [openLinkPopover, setOpenLinkPopover] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      Link.configure({ openOnClick: true }),
      BulletList,
      OrderedList,
      ListItem,
    ],
    content: "",
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
  });

  const form = useForm<z.infer<typeof urlSchema>>({
    resolver: zodResolver(urlSchema),
    defaultValues: { url: "https://" },
  });

  const t = editor ? editor.getHTML() : "";
  useEffect(() => {
    if (!editor) return;
    setText(t);
  }, [t]);

  const setLink = (inputs: z.infer<typeof urlSchema>) => {
    if (!editor) return;

    // const prevUrl = editor.getAttributes("link").href as string | undefined;
    const url = inputs.url;

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().setLink({ href: url }).run();
  };

  if (!editor) return null;

  return (
    <div className="space-y-4 rounded-lg">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <MenuButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          icon={<BoldIcon size={18} />}
        />

        <MenuButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          icon={<ItalicIcon size={18} />}
        />

        <MenuButton
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          icon={<UnderlineIcon size={18} />}
        />

        <MenuButton
          active={editor.isActive("link")}
          onClick={() => setOpenLinkPopover(true)}
          icon={<LinkIcon size={18} />}
        />

        <MenuButton
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          icon={<BulletIcon size={18} />}
        />

        <MenuButton
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          icon={<NumberIcon size={18} />}
        />
        <Popover open={openLinkPopover} onOpenChange={setOpenLinkPopover}>
          <PopoverTrigger></PopoverTrigger>
          <PopoverContent className="translate-y-5" align="center">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(setLink)}>
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enter link url.</FormLabel>
                      <FormControl>
                        <Input placeholder="www.domain.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="mt-4 flex items-center justify-end gap-1">
                  <Button
                    type="button"
                    onClick={() => {
                      form.reset();
                      setOpenLinkPopover(false);
                    }}
                    variant={"outline"}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="">
                    Ok
                  </Button>
                </div>
              </form>
            </Form>
          </PopoverContent>
        </Popover>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="editor-content min-h-[220px] rounded-lg border p-4 focus:ring-0 focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:focus:outline-none"
      />
    </div>
  );
}
