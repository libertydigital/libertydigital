import { cn } from "@/lib/utils";

type EnrollmentWorkflowGraphicProps = {
  title: string;
  highlight: string;
  stepsCount: number;
  className?: string;
};

export function EnrollmentWorkflowGraphic({
  title,
  highlight,
  stepsCount,
  className,
}: EnrollmentWorkflowGraphicProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[30px] border border-[rgba(17,32,49,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,238,229,0.92))] p-5 shadow-[0_24px_50px_rgba(7,16,26,0.08)]",
        className,
      )}
    >
      <svg
        aria-hidden="true"
        className="h-auto w-full"
        viewBox="0 0 760 440"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="enrollmentCard" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#fcfaf5" />
            <stop offset="100%" stopColor="#efe5d4" />
          </linearGradient>
          <linearGradient id="enrollmentDark" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#152435" />
            <stop offset="100%" stopColor="#0c1824" />
          </linearGradient>
        </defs>

        <rect fill="#f7f2ea" height="440" rx="34" width="760" />
        <circle cx="670" cy="72" fill="rgba(177,138,81,0.10)" r="78" />
        <circle cx="110" cy="364" fill="rgba(109,132,153,0.10)" r="92" />

        <rect
          fill="url(#enrollmentDark)"
          height="240"
          rx="28"
          stroke="rgba(255,255,255,0.08)"
          width="238"
          x="42"
          y="86"
        />
        <rect
          fill="rgba(255,255,255,0.08)"
          height="30"
          rx="15"
          width="150"
          x="68"
          y="114"
        />
        <text
          fill="#ead9bc"
          fontFamily="Arial, sans-serif"
          fontSize="16"
          fontWeight="700"
          letterSpacing="3"
          x="68"
          y="136"
        >
          {highlight.toUpperCase()}
        </text>
        <text
          fill="#ffffff"
          fontFamily="Georgia, serif"
          fontSize="34"
          fontWeight="700"
          x="68"
          y="192"
        >
          Start request
        </text>
        <text
          fill="rgba(255,255,255,0.78)"
          fontFamily="Arial, sans-serif"
          fontSize="18"
          x="68"
          y="226"
        >
          Choose service and review requirements
        </text>

        <path
          d="M300 208 C348 208, 348 208, 396 208"
          fill="none"
          stroke="#b18a51"
          strokeDasharray="10 10"
          strokeLinecap="round"
          strokeWidth="4"
        />
        <circle cx="408" cy="208" fill="#b18a51" r="14" />

        <rect
          fill="url(#enrollmentCard)"
          height="284"
          rx="28"
          stroke="rgba(17,32,49,0.08)"
          width="290"
          x="428"
          y="58"
        />
        <text
          fill="#122031"
          fontFamily="Georgia, serif"
          fontSize="28"
          fontWeight="700"
          x="458"
          y="106"
        >
          {title.length > 24 ? `${title.slice(0, 24)}...` : title}
        </text>
        <text
          fill="rgba(17,32,49,0.60)"
          fontFamily="Arial, sans-serif"
          fontSize="15"
          letterSpacing="2.5"
          x="458"
          y="136"
        >
          ENROLLMENT FLOW
        </text>

        {[0, 1, 2].map((index) => (
          <g key={index} transform={`translate(458 ${166 + index * 62})`}>
            <circle cx="16" cy="16" fill="#122031" r="16" />
            <text
              fill="#ffffff"
              fontFamily="Arial, sans-serif"
              fontSize="14"
              fontWeight="700"
              textAnchor="middle"
              x="16"
              y="21"
            >
              {index + 1}
            </text>
            <rect
              fill="rgba(17,32,49,0.05)"
              height="34"
              rx="17"
              width="192"
              x="44"
              y="-1"
            />
            <text
              fill="#223447"
              fontFamily="Arial, sans-serif"
              fontSize="14"
              fontWeight="600"
              x="60"
              y="21"
            >
              {index === 0
                ? "Prepare documents"
                : index === 1
                  ? "Complete the form"
                  : "Submit for review"}
            </text>
          </g>
        ))}

        <rect
          fill="#ffffff"
          height="70"
          rx="22"
          stroke="rgba(17,32,49,0.08)"
          width="290"
          x="428"
          y="356"
        />
        <text
          fill="#b18a51"
          fontFamily="Arial, sans-serif"
          fontSize="14"
          fontWeight="700"
          letterSpacing="2.8"
          x="456"
          y="387"
        >
          TOTAL STEPS
        </text>
        <text
          fill="#122031"
          fontFamily="Georgia, serif"
          fontSize="30"
          fontWeight="700"
          x="456"
          y="416"
        >
          {stepsCount}
        </text>
      </svg>
    </div>
  );
}
