export default function AdditionalInfoDescriptions({ des }: { des: string }) {
  return (
    <div id="html_descriptions">
      <div className="prose" dangerouslySetInnerHTML={{ __html: des }}></div>
    </div>
  );
}
