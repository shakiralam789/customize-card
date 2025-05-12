import RangeFeature from "./RangeFeature";

export default function LetterSpacingChange() {
  return (
    <RangeFeature
      propertyName="letterSpacing"
      title="Letter Spacing"
      min={-0.25}
      max={1}
      step={0.01}
      defValue={0}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 1 24 24"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="m16.28 15.916 2.835 2.835m0 0-2.835 2.835m2.835-2.835H5.885m0 0 2.835-2.835M5.885 18.75l2.835 2.835m3.202-9.01-3.51-8.033-3.51 8.034m15.196-8.034-3.51 8.034-3.51-8.034m-6.92 5.162h4.51"
        ></path>
      </svg>
    </RangeFeature>
  );
}
