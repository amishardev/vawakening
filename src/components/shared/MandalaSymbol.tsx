import { cn } from "@/lib/utils";

interface MandalaSymbolProps extends React.SVGProps<SVGSVGElement> {
  // You can add custom props here if needed
}

export function MandalaSymbol({ className, ...props }: MandalaSymbolProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 100" 
      className={cn("w-6 h-6", className)}
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3"
      {...props}
    >
      <circle cx="50" cy="50" r="40" />
      <circle cx="50" cy="50" r="30" />
      <circle cx="50" cy="50" r="20" />
      <circle cx="50" cy="50" r="10" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
        <line 
          key={angle}
          x1="50" 
          y1="50" 
          x2={50 + 40 * Math.cos(angle * Math.PI / 180)} 
          y2={50 + 40 * Math.sin(angle * Math.PI / 180)} 
        />
      ))}
      {[0, 60, 120, 180, 240, 300].map(angle => (
        <circle 
          key={`outer-${angle}`}
          cx={50 + 30 * Math.cos(angle * Math.PI / 180)} 
          cy={50 + 30 * Math.sin(angle * Math.PI / 180)} 
          r="5" 
          fill="currentColor"
          stroke="none"
        />
      ))}
    </svg>
  );
}
