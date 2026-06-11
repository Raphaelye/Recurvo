export const colors = {
    background: "#161616",

    foreground: "#FFFFFF",
    muted: "#8E8E93",
    
    accent:"#fd683d",

    card: "rgba(225, 225, 225, 0.06)",
    border: "rgba(225, 225, 225, 0.1)",
    
} as const;

export const spacing = {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    11: 44,
    12: 48,
    14: 56,
    16: 64,
    18: 72,
    20: 80,
    24: 96,
    30: 120,
} as const;

export const components = {
    tabBar: {
        height: spacing[16],
        horizontalInset: spacing[6],
        radius: spacing[8],
        iconFrame: spacing[12],
        itemPaddingVertical: spacing[2],
    },
} as const;

export const theme = {
    colors,
    spacing,
    components,
} as const;