export const ROLE_COLORS = {
  lime: {
    bg: 'bg-lime-400/10',
    border: 'border-lime-500/30',
    text: 'text-lime-400',
    dot: 'bg-lime-400',
    hover: 'hover:border-lime-500/50 hover:bg-lime-400/15',
  },
  sky: {
    bg: 'bg-sky-400/10',
    border: 'border-sky-500/30',
    text: 'text-sky-400',
    dot: 'bg-sky-400',
    hover: 'hover:border-sky-500/50 hover:bg-sky-400/15',
  },
  violet: {
    bg: 'bg-violet-400/10',
    border: 'border-violet-500/30',
    text: 'text-violet-400',
    dot: 'bg-violet-400',
    hover: 'hover:border-violet-500/50 hover:bg-violet-400/15',
  },
  amber: {
    bg: 'bg-amber-400/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    dot: 'bg-amber-400',
    hover: 'hover:border-amber-500/50 hover:bg-amber-400/15',
  },
  rose: {
    bg: 'bg-rose-400/10',
    border: 'border-rose-500/30',
    text: 'text-rose-400',
    dot: 'bg-rose-400',
    hover: 'hover:border-rose-500/50 hover:bg-rose-400/15',
  },
  teal: {
    bg: 'bg-teal-400/10',
    border: 'border-teal-500/30',
    text: 'text-teal-400',
    dot: 'bg-teal-400',
    hover: 'hover:border-teal-500/50 hover:bg-teal-400/15',
  }
};

export function getRoleColor(colorName) {
  return ROLE_COLORS[colorName] || ROLE_COLORS.lime;
}
