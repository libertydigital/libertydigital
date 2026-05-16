import { cn } from "@/lib/utils";

type EnrollmentWorkflowGraphicProps = {
  title: string;
  highlight: string;
  stepsCount: number;
  className?: string;
};

function truncateText(value: string, maxLength: number) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value;
}

function splitIntoLines(value: string, maxLength: number) {
  const words = value.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (nextLine.length <= maxLength) {
      currentLine = nextLine;
      continue;
    }

    if (currentLine) {
      lines.push(currentLine);
      currentLine = word;
      continue;
    }

    lines.push(truncateText(word, maxLength));
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

export function EnrollmentWorkflowGraphic({
  title,
  highlight,
  stepsCount,
  className,
}: EnrollmentWorkflowGraphicProps) {
  const kickerText = truncateText(highlight.toUpperCase(), 22);
  const startRequestLines = splitIntoLines(
    "Choose service and review requirements",
    26,
  ).slice(0, 2);
  const titleLines = splitIntoLines(title, 20).slice(0, 2);

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
          <clipPath id="leftCardClip">
            <rect height="240" rx="28" width="238" x="42" y="86" />
          </clipPath>
          <clipPath id="rightCardClip">
            <rect height="284" rx="28" width="290" x="428" y="58" />
          </clipPath>
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
        <g clipPath="url(#leftCardClip)">
          <text
            fill="#ead9bc"
            fontFamily="Arial, sans-serif"
            fontSize="12"
            fontWeight="700"
            letterSpacing="1.8"
            x="68"
            y="132"
          >
            {kickerText}
          </text>
          <text
            fill="#ffffff"
            fontFamily="Georgia, serif"
            fontSize="28"
            fontWeight="700"
            x="68"
            y="188"
          >
            Start request
          </text>
          <text
            fill="rgba(255,255,255,0.78)"
            fontFamily="Arial, sans-serif"
            fontSize="16"
            x="68"
            y="218"
          >
            {startRequestLines.map((line, index) => (
              <tspan dy={index === 0 ? 0 : 22} key={line} x="68">
                {line}
              </tspan>
            ))}
          </text>
        </g>

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
        <g clipPath="url(#rightCardClip)">
          <text
            fill="#122031"
            fontFamily="Georgia, serif"
            fontSize="28"
            fontWeight="700"
            x="458"
            y="106"
          >
            {titleLines.map((line, index) => (
              <tspan dy={index === 0 ? 0 : 30} key={line} x="458">
                {line}
              </tspan>
            ))}
          </text>
          <text
            fill="rgba(17,32,49,0.60)"
            fontFamily="Arial, sans-serif"
            fontSize="15"
            letterSpacing="2.5"
            x="458"
            y="164"
          >
            ENROLLMENT FLOW
          </text>
        </g>

        {[0, 1, 2].map((index) => (
          <g key={index} transform={`translate(458 ${194 + index * 62})`}>
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
