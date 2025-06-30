
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AdminStatCardProps {
    title: string;
    value: number | string;
    description: string;
    icon: LucideIcon;
    color: 'blue' | 'green' | 'yellow' | 'red';
}

const colorVariants = {
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/20",
    green: "bg-green-500/10 text-green-600 dark:text-green-300 border-green-500/20",
    yellow: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-300 border-yellow-500/20",
    red: "bg-red-500/10 text-red-600 dark:text-red-300 border-red-500/20",
}

const iconColorVariants = {
    blue: "text-blue-500",
    green: "text-green-500",
    yellow: "text-yellow-500",
    red: "text-red-500",
}

export function AdminStatCard({ title, value, description, icon: Icon, color }: AdminStatCardProps) {
    return (
        <Card className={cn("shadow-sm border-none", colorVariants[color])}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className={cn("h-4 w-4", iconColorVariants[color])} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}
