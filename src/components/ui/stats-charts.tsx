import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { name: "Lun", asistencias: 65, nuevos: 4 },
  { name: "Mar", asistencias: 78, nuevos: 6 },
  { name: "Mié", asistencias: 82, nuevos: 3 },
  { name: "Jue", asistencias: 89, nuevos: 8 },
  { name: "Vie", asistencias: 95, nuevos: 5 },
  { name: "Sáb", asistencias: 72, nuevos: 2 },
  { name: "Dom", asistencias: 45, nuevos: 1 },
];

export function StatsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estadísticas Semanales</CardTitle>
        <CardDescription>Asistencias y nuevos miembros</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="colorAsistencias"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="colorNuevos" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--secondary))"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--secondary))"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Area
                type="monotone"
                dataKey="asistencias"
                stroke="hsl(var(--primary))"
                fillOpacity={1}
                fill="url(#colorAsistencias)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="nuevos"
                stroke="hsl(var(--secondary))"
                fillOpacity={1}
                fill="url(#colorNuevos)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span className="text-sm text-muted-foreground">Asistencias</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-secondary"></div>
            <span className="text-sm text-muted-foreground">
              Nuevos Miembros
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
