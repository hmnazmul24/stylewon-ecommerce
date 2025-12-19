"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSizeColorOptions } from "../hooks/use-add-product";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HexColorPicker } from "react-colorful";
import { UseFormReturn } from "react-hook-form";
import { AddProductSchemaType } from "../schemas";
export default function AddProductOptions({
  form,
}: {
  form: UseFormReturn<AddProductSchemaType>;
}) {
  const { sizes, colors, optionDialogOpen, setOptionDialogOpen } =
    useSizeColorOptions();

  useEffect(() => {
    form.setValue("colors", colors);
  }, [colors]);

  useEffect(() => {
    form.setValue("sizes", sizes);
  }, [sizes]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Options (size, color)</CardTitle>
        <CardDescription>
          Does your product come in different options, like size, color or
          material? Add them here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup className="items-start">
          <SizeColorListing colors={colors} sizes={sizes} />
          <Dialog open={optionDialogOpen} onOpenChange={setOptionDialogOpen}>
            <DialogTrigger asChild>
              <Button type="button" className="rounded-full ">
                <Plus /> Add Options
              </Button>
            </DialogTrigger>
            <DialogContent className="min-h-[350px]">
              <DialogHeader>
                <DialogTitle></DialogTitle>
                <ProductOptionsBox />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}

const defaultSizes: Option[] = [
  { label: "Large", value: "large" },
  { label: "Mediam", value: "mediam" },
  { label: "Small", value: "small" },
];
export type ColorOption = Option & { hexColor?: string };
const defaultColors: ColorOption[] = [
  { label: "Red", value: "red", hexColor: "#FF0000" },
  { label: "Blue", value: "blue", hexColor: "#0000FF" },
  { label: "Purple", value: "purple", hexColor: "#800080" },
];

function ProductOptionsBox() {
  const {
    sizes,
    colors,
    setColors,
    setSizes,
    selectedOption,
    setSelectedOption,
    setOptionDialogOpen,
  } = useSizeColorOptions();
  return (
    <FieldGroup>
      <Field>
        <FieldLabel>Select specifiq option</FieldLabel>
        <Select
          value={selectedOption}
          onValueChange={(v) => setSelectedOption(v as "size" | "color")}
        >
          <SelectTrigger>
            <SelectValue placeholder={"Options"} />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectItem value="size">Size</SelectItem>
            <SelectItem value="color">Color</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      {selectedOption === "size" ? (
        <Field key={1}>
          <FieldLabel>Select or add new sizes</FieldLabel>
          <MultipleSelector
            value={sizes}
            defaultOptions={defaultSizes}
            onChange={setSizes}
            creatable
          />
          <FieldDescription className="text-start">
            This is a multi select input field where you can add any sizes you
            want.
          </FieldDescription>
        </Field>
      ) : (
        <Field key={2}>
          <FieldLabel>Select or add new colors</FieldLabel>
          <MultipleSelector
            value={colors}
            defaultOptions={defaultColors}
            onChange={setColors}
            creatable
          />
          <FieldDescription className="text-start">
            This is a multi select input field where you can add any colors you
            want.
          </FieldDescription>
        </Field>
      )}
      <Field orientation={"horizontal"}>
        <Button type="button" onClick={() => setOptionDialogOpen(false)}>
          Finish
        </Button>
      </Field>
    </FieldGroup>
  );
}

function SizeColorListing({
  sizes,
  colors,
}: {
  sizes: Option[];
  colors: ColorOption[];
}) {
  const { setOptionDialogOpen, setSelectedOption, setColors, setSizes } =
    useSizeColorOptions();

  return (
    <Field>
      {(sizes.length !== 0 || colors.length !== 0) && <FieldSeparator />}
      {sizes.length !== 0 && (
        <div className="flex items-center w-full">
          <div className="w-12 text-md font-medium">Sizes</div>
          <div className="flex-1 flex flex-wrap gap-1 justify-start">
            {sizes?.length ? (
              sizes.map((s) => (
                <Badge key={s.value} className=" rounded-full text-xs">
                  {s.label}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-gray-500">No sizes available</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                setSelectedOption("size");
                setOptionDialogOpen(true);
              }}
              type="button"
              variant="outline"
              size="icon"
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => setSizes([])}
              type="button"
              variant="destructive"
              size="icon"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {colors.length !== 0 && (
        <div className="flex items-center w-full">
          <div className="w-14 text-md font-medium">Colors</div>
          <div className="flex-1 flex flex-wrap gap-1 justify-start">
            {colors?.length ? (
              colors.map((c) => (
                <div
                  key={c.value}
                  className="flex items-center gap-1 px-2 rounded-xl text-xs py-1 "
                >
                  <Popover>
                    <PopoverTrigger asChild>
                      <span
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: c.hexColor }}
                      />
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-2"
                      align="center"
                      side="right"
                    >
                      <ColorPicker label={c.label} />
                    </PopoverContent>
                  </Popover>
                  <span>{c.label}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No colors available</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                setSelectedOption("color");
                setOptionDialogOpen(true);
              }}
              type="button"
              variant="outline"
              size="icon"
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              onClick={() => {
                setColors([]);
              }}
              variant="destructive"
              size="icon"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
      {(sizes.length !== 0 || colors.length !== 0) && <FieldSeparator />}
    </Field>
  );
}

function ColorPicker({ label }: { label: string }) {
  const { colors, setColors } = useSizeColorOptions();
  const [color, setColor] = useState("#aabbcc");

  const onChange = (color: string) => {
    setColor(color);
    const selectedColor = colors.map((c) => {
      return c.label === label ? ({ ...c, hexColor: color } as ColorOption) : c;
    });
    setColors(selectedColor);
  };
  return <HexColorPicker color={color} onChange={onChange} />;
}
