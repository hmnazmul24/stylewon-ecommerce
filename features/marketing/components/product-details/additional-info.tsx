import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Heading } from "../shared/heading";
import AdditionalInfoDescriptions from "./additional-info-description";
import AdditionalInfoQNA from "./additional-info-qna";
import AdditionalInfoReviews from "./additional-info-reviews";

export default function AdditionalInfo({ des }: { des: string }) {
  return (
    <div className="m-auto max-w-5xl p-2 lg:p-0">
      <Heading>Additional Info</Heading>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Field>
          <FieldLabel>Descriptions</FieldLabel>
          <FieldContent>
            <AdditionalInfoDescriptions des={des} />
          </FieldContent>
        </Field>
        {/* <Field>
          <FieldLabel>Reviews</FieldLabel>
          <FieldContent>
            <AdditionalInfoReviews />
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel>Q & A</FieldLabel>
          <FieldContent>
            <AdditionalInfoQNA />
          </FieldContent>
        </Field> */}
      </div>
    </div>
  );
}
