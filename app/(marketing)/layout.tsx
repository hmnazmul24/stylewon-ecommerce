import MarketingLayout from "@/features/marketing/layout";

export default function layout(props: LayoutProps<"/">) {
  return (
    <div className="noise-background">
      <MarketingLayout {...props} />;
    </div>
  );
}
