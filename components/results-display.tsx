"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { UCPResults } from "@/lib/types"
import { motion } from "framer-motion"
import { ArrowRight, TrendingUp, Clock, Layers, BarChart3, PieChart } from "lucide-react"

interface ResultsDisplayProps {
  results: UCPResults
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  const pieData = [
    { name: "Actors", value: results.uaw, color: "hsl(var(--primary))" },
    { name: "Use Cases", value: results.uucw, color: "hsl(var(--primary)/0.6)" },
  ]

  const barData = [
    { name: "Simple", actors: results.actorCounts.simple, useCases: results.useCaseCounts.simple },
    { name: "Average", actors: results.actorCounts.average, useCases: results.useCaseCounts.average },
    { name: "Complex", actors: results.actorCounts.complex, useCases: results.useCaseCounts.complex },
  ]

  // Calculate total for pie chart percentages
  const total = pieData.reduce((sum, item) => sum + item.value, 0)

  // Create simple pie chart renderer
  const renderSimplePieChart = () => {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center">
        <div className="relative h-64 w-64 border border-primary/10 rounded-full p-2">
          {/* Simple pie chart with two segments */}
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Background circle */}
            <circle cx="50" cy="50" r="50" fill="hsl(var(--muted))" />

            {/* Actors segment (full circle) */}
            <circle cx="50" cy="50" r="50" fill="hsl(var(--primary))" />

            {/* Use Cases segment (partial circle based on proportion) */}
            <path
              d={`M 50 50 L 50 0 A 50 50 0 ${pieData[0].value / total > 0.5 ? 1 : 0} 1 ${
                50 + 50 * Math.sin((pieData[0].value / total) * Math.PI * 2)
              } ${50 - 50 * Math.cos((pieData[0].value / total) * Math.PI * 2)} Z`}
              fill="hsl(var(--primary)/0.6)"
            />

            {/* Inner circle */}
            <circle cx="50" cy="50" r="25" fill="hsl(var(--card))" stroke="hsl(var(--primary)/0.1)" strokeWidth="1" />

            {/* Total value */}
            <text
              x="50"
              y="50"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-current text-3xl font-bold"
            >
              {total}
            </text>
          </svg>
        </div>

        <div className="flex justify-center mt-6 space-x-8">
          {pieData.map((item, index) => (
            <div key={index} className="flex items-center border border-primary/10 rounded-md px-3 py-1">
              <div className="w-4 h-4 mr-2 rounded-sm" style={{ backgroundColor: item.color }} />
              <div>
                <div className="text-sm font-medium">{item.name}</div>
                <div className="text-xs text-muted-foreground">
                  {item.value} ({Math.round((item.value / total) * 100)}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Create simple bar chart renderer
  const renderSimpleBarChart = () => (
    <div className="h-full w-full flex flex-col">
      <div className="flex-1 flex items-end justify-around pt-6">
        {barData.map((entry, index) => (
          <div
            key={index}
            className="flex flex-col items-center px-4 mx-1 border-r border-l border-dashed border-primary/20 last:border-r-0 first:border-l-0"
          >
            <div className="flex space-x-6">
              {/* Actors bar */}
              <div className="flex flex-col items-center">
                <div className="h-[200px] flex flex-col justify-end">
                  <div
                    className="w-16 bg-primary rounded-t-md flex items-end justify-center"
                    style={{ height: `${Math.max(entry.actors * 30, 5)}px` }}
                  >
                    <span className="text-white font-medium py-1">{entry.actors}</span>
                  </div>
                </div>
                <div className="text-xs mt-2 text-primary/80 font-medium">Actors</div>
              </div>

              {/* Use Cases bar */}
              <div className="flex flex-col items-center">
                <div className="h-[200px] flex flex-col justify-end">
                  <div
                    className="w-16 bg-primary/60 rounded-t-md flex items-end justify-center"
                    style={{ height: `${Math.max(entry.useCases * 15, 5)}px` }}
                  >
                    <span className="text-white font-medium py-1">{entry.useCases}</span>
                  </div>
                </div>
                <div className="text-xs mt-2 text-primary/60 font-medium">Use Cases</div>
              </div>
            </div>
            <div className="mt-4 text-sm font-medium">{entry.name}</div>
          </div>
        ))}
      </div>

      {/* Add a light horizontal line at the bottom */}
      <div className="w-full h-px bg-primary/10 mt-4"></div>
    </div>
  )

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-3xl font-bold gradient-text pb-1">Effort Estimation Results</h2>
        <p className="text-muted-foreground">
          Based on {results.actorCounts.simple + results.actorCounts.average + results.actorCounts.complex} actors and{" "}
          {results.useCaseCounts.simple + results.useCaseCounts.average + results.useCaseCounts.complex} use cases
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="card-hover card-highlight">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Clock className="mr-2 h-5 w-5 text-primary" />
                Total Effort
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{results.effort.toFixed(1)}</div>
              <p className="text-sm text-muted-foreground mt-1">
                hours ({(results.effort / 8).toFixed(1)} person-days)
              </p>
              <div className="mt-4 pt-4 border-t border-border flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1" />
                Based on {results.productivityFactor} hours per UCP
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="card-hover card-highlight">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Layers className="mr-2 h-5 w-5 text-primary" />
                Use Case Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{results.ucp.toFixed(2)}</div>
              <p className="text-sm text-muted-foreground mt-1">UCP = UUCP × TCF × ECF</p>
              <div className="mt-4 pt-4 border-t border-border flex items-center text-xs text-muted-foreground">
                <ArrowRight className="h-3 w-3 mr-1" />
                UUCP: {results.uucp.toFixed(2)} | TCF: {results.tcf.toFixed(2)} | ECF: {results.ecf.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="card-hover card-highlight">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-primary" />
                Complexity Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Actors</div>
                  <div className="flex items-end space-x-2 mt-1">
                    <div className="text-xl font-semibold">{results.uaw}</div>
                    <div className="text-xs text-muted-foreground pb-1">weight</div>
                  </div>
                  <div className="mt-1 flex space-x-1 text-xs">
                    <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                      S: {results.actorCounts.simple}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-primary/20 text-primary">
                      A: {results.actorCounts.average}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-primary/30 text-primary">
                      C: {results.actorCounts.complex}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Use Cases</div>
                  <div className="flex items-end space-x-2 mt-1">
                    <div className="text-xl font-semibold">{results.uucw}</div>
                    <div className="text-xs text-muted-foreground pb-1">weight</div>
                  </div>
                  <div className="mt-1 flex space-x-1 text-xs">
                    <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary/80">
                      S: {results.useCaseCounts.simple}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-primary/20 text-primary/80">
                      A: {results.useCaseCounts.average}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-primary/30 text-primary/80">
                      C: {results.useCaseCounts.complex}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <PieChart className="mr-2 h-5 w-5 text-primary" />
                Weight Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">{renderSimplePieChart()}</CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-primary" />
                Complexity Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">{renderSimpleBarChart()}</CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Detailed Calculation</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30%]">Metric</TableHead>
                  <TableHead className="w-[50%]">Calculation</TableHead>
                  <TableHead className="w-[20%]">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Unadjusted Actor Weight (UAW)</TableCell>
                  <TableCell>
                    <span className="text-primary/70">(Simple × 1)</span> +
                    <span className="text-primary/80"> (Average × 2)</span> +
                    <span className="text-primary"> (Complex × 3)</span>
                  </TableCell>
                  <TableCell>{results.uaw}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Unadjusted Use Case Weight (UUCW)</TableCell>
                  <TableCell>
                    <span className="text-primary/70">(Simple × 5)</span> +
                    <span className="text-primary/80"> (Average × 10)</span> +
                    <span className="text-primary"> (Complex × 15)</span>
                  </TableCell>
                  <TableCell>{results.uucw}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Unadjusted Use Case Points (UUCP)</TableCell>
                  <TableCell>UAW + UUCW</TableCell>
                  <TableCell>{results.uucp}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Technical Complexity Factor (TCF)</TableCell>
                  <TableCell>0.6 + (TFactor / 100)</TableCell>
                  <TableCell>{results.tcf.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Environmental Complexity Factor (ECF)</TableCell>
                  <TableCell>1.4 + (-0.03 × EFactor)</TableCell>
                  <TableCell>{results.ecf.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Use Case Points (UCP)</TableCell>
                  <TableCell>UUCP × TCF × ECF</TableCell>
                  <TableCell>{results.ucp.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Effort</TableCell>
                  <TableCell>UCP × Productivity Factor ({results.productivityFactor})</TableCell>
                  <TableCell>{results.effort.toFixed(1)} hours</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
