import { Bell, type LucideIcon, Rabbit, Shield } from "lucide-react";

type FeatureType = {
    icon: LucideIcon,
    title: string,
    description: string
}

export const FEATURES: FeatureType[] = [
    {
        icon: Rabbit,
        title: "Lightning Fast",
        description: "DipDrop extracts prices in seconds, handling JavaScript and dynamic content",
    },
    {
        icon: Shield,
        title: "Always Reliable",
        description: "Works across all major e-commerce sites with built-in anti-bot protection",
    },
    {
        icon: Bell,
        title: "Smart Alerts",
        description: "Get notified instantly when prices drop below your target",
    },
];
