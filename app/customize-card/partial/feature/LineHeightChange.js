import RangeFeature from "./RangeFeature";

export default function LineHeightChange() {
  return (
    <RangeFeature
      propertyName="lineHeight"
      title="Line Height"
      min={0}
      max={500}
      step={5}
      defValue={1.5}
      unit="%"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="24"
        fill="none"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="m4.5 8.22 2.835-2.835m0 0L10.17 8.22M7.335 5.385v13.23m0 0L4.5 15.78m2.835 2.835 2.835-2.835m3.848-3.686H20.5m-6.483 5.708H20.5M14.018 6.193H20.5"
        ></path>
      </svg>
    </RangeFeature>
  );
}
