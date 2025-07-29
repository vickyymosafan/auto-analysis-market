import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
}

export const Icon: React.FC<IconProps> = ({ name, className, ...props }) => {
  const icons: { [key: string]: React.ReactNode } = {
    uploadCloud: (
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
    ),
    check: <path d="M20 6 9 17l-5-5" />,
    checkCircle: <><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>,
    xCircle: <><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></>,
    arrowRight: <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>,
    rotateCcw: <><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></>,
    brainCircuit: <><path d="M12 5a3 3 0 1 0-5.993.142" /><path d="M18 5a3 3 0 1 0-5.993.142" /><path d="M12 19a3 3 0 1 0-5.993-.142" /><path d="M18 19a3 3 0 1 0-5.993-.142" /><path d="M12 12a3 3 0 1 0-5.993-.142" /><path d="M18 12a3 3 0 1 0-5.993-.142" /><path d="M6 7.86V5" /><path d="M6 19v-2.86" /><path d="M18 7.86V5" /><path d="M18 19v-2.86" /><path d="M12 7.86V5" /><path d="M12 19v-2.86" /><path d="M6.007 12h-1.5" /><path d="M19.5 12h-1.5" /></>,
    dollarSign: <><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></>,
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {icons[name] || <circle cx="12" cy="12" r="10" />}
    </svg>
  );
};