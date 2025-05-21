import RangeFeature from "./RangeFeature";

export default function TextCurveChange() {
  return (
    <RangeFeature
      propertyName="textCurve"
      title="Text curve"
      min={-100}
      max={100}
      step={1}
      defValue={0}
      unit="%"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M11.402 12.875 7.435 5.39l-2.797 7.997m1-2.859 4.346-.328m-6.449 9.553c2.53-1.454 5.71-2.25 9.004-2.223s6.446.873 8.926 2.366m-5.75-14.744 2.485.345c1.006.14 1.803 1 1.76 2.016a1.946 1.946 0 0 1-2.213 1.85l-2.567-.356zm-.535 3.853 3.174.442c1.007.14 1.804 1 1.76 2.016a1.946 1.946 0 0 1-2.212 1.85l-3.258-.453z"
        ></path>
      </svg>
    </RangeFeature>
  );
}
