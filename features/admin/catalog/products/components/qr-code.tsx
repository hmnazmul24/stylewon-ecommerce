"use client";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import jsPDF from "jspdf";
import { Download } from "lucide-react";
import { useTransition } from "react";
import QRCode from "react-qr-code";

type QRCodeProductType = {
  id: string;
  name: string;
  price: string;
};

//-------------------- A4 GRID CONSTANTS -------------------- //
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;

const MARGIN_X = 10;
const MARGIN_Y = 12;

const COLS = 5;
const ROWS = 6;

const GAP_X = 6;
const GAP_Y = 6;

const LABEL_WIDTH = (PAGE_WIDTH - MARGIN_X * 2 - GAP_X * (COLS - 1)) / COLS;

const LABEL_HEIGHT = (PAGE_HEIGHT - MARGIN_Y * 2 - GAP_Y * (ROWS - 1)) / ROWS;

// -----------------------createcanvas-----------------//

async function createCanvas(product: QRCodeProductType) {
  const svg = document.getElementById(`qr-${product.id}`)?.querySelector("svg");
  if (!svg) return null;
  const source = new XMLSerializer().serializeToString(svg);
  const img = new Image();
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);

  return new Promise<HTMLCanvasElement>((resolve) => {
    const size = 300;
    const titleHeight = 40;
    const priceHeight = 70;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size + titleHeight + priceHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    img.onload = () => {
      ctx.fillStyle = "#000";
      ctx.font = "20px system-ui";
      ctx.textAlign = "start";
      ctx.fillText(product.name, 0, 25);
      ctx.drawImage(img, 0, titleHeight, size, size);
      ctx.fillStyle = "#000000";

      ctx.font = "bold 50px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(`৳ ${product.price}`, size / 2, size + titleHeight + 60);
      resolve(canvas);
    };
  });
}

// --------------------------download single ---------//

// download single
export function DownloadSingleQRCode(product: QRCodeProductType) {
  async function downloadSingleQrPdf(product: QRCodeProductType) {
    const canvas = await createCanvas(product);
    if (!canvas) return;
    const pdf = new jsPDF("p", "mm", "a4");
    const image = canvas.toDataURL("image/png");
    pdf.addImage(image, "PNG", MARGIN_X, MARGIN_Y, LABEL_WIDTH, LABEL_HEIGHT);
    pdf.save(`${product.id}-qr.pdf`);
  }

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/qr-code-scan/${product.id}`;

  return (
    <div key={product.id} className="space-y-4 p-4">
      <div className="space-y-1">
        <p className="font-medium">{product.name}</p>
        <p className="text-muted-foreground text-xs">৳ {product.price}</p>
      </div>

      <div
        id={`qr-${product.id}`}
        className="text-background flex justify-center rounded-xl border bg-white p-3"
      >
        <QRCode value={url} size={140} />
      </div>

      <Button
        onClick={() => downloadSingleQrPdf(product)}
        className="w-full rounded-xl"
      >
        Download QR PDF
      </Button>
    </div>
  );
}

export function DownloadAllQRCodePDF({
  products,
}: {
  products: QRCodeProductType[];
}) {
  async function downloadAllQrPdf() {
    const pdf = new jsPDF("p", "mm", "a4");
    const PER_PAGE = COLS * ROWS;

    for (let i = 0; i < products.length; i++) {
      if (i % PER_PAGE === 0 && i !== 0) pdf.addPage();
      const index = i % PER_PAGE;
      const col = index % COLS;
      const row = Math.floor(index / COLS);
      const x = MARGIN_X + col * (LABEL_WIDTH + GAP_X);
      const y = MARGIN_Y + row * (LABEL_HEIGHT + GAP_Y);
      const canvas = await createCanvas(products[i]);
      if (!canvas) continue;

      const img = canvas.toDataURL("image/png");
      pdf.addImage(img, "PNG", x, y, LABEL_WIDTH, LABEL_HEIGHT);
    }

    pdf.save("product-qr-labels.pdf");
  }

  const { isPending, mutate } = useMutation({ mutationFn: downloadAllQrPdf });

  return (
    <div className="flex items-center justify-end py-4">
      <div className="hidden">
        {products.map((p) => {
          const url = `${process.env.NEXT_PUBLIC_BASE_URL}/qr-code-scan/${p.id}`;

          return (
            <div
              key={p.id}
              id={`qr-${p.id}`}
              className="text-background flex justify-center rounded-xl border bg-white p-3"
            >
              <QRCode value={url} size={140} />
            </div>
          );
        })}
      </div>

      <Button variant={"outline"} disabled={isPending} onClick={() => mutate()}>
        <Download /> Download All QRcodes
      </Button>
    </div>
  );
}

// ..................................download all.......//
