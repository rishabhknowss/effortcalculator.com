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

  // Calculate the maximum value for scaling the bars
  const maxActorCount = Math.max(...barData.map((item) => item.actors))
  const maxUseCaseCount = Math.max(...barData.map((item) => item.useCases))
  const maxBarHeight = 180 // Maximum height for bars in pixels

  // Calculate total for pie chart percentages
  const total = pieData.reduce((sum, item) => sum + item.value, 0)

  // Create enhanced pie chart renderer
  const renderEnhancedPieChart = () => {
    // Calculate the angles for the pie slices
    let startAngle = 0
    const slices = pieData.map((item, index) => {
      const percentage = item.value / total
      const angle = percentage * 360
      const slice = {
        ...item,
        startAngle,
        endAngle: startAngle + angle,
        percentage,
      }
      startAngle += angle
      return slice
    })

    return (
      <div className="h-full w-full flex flex-col items-center justify-center">
        <div className="relative h-64 w-64">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {slices.map((slice, index) => {
              // Convert angles to radians for SVG arc
              const startRad = (slice.startAngle * Math.PI) / 180
              const endRad = (slice.endAngle * Math.PI) / 180

              // Calculate the SVG arc path
              const x1 = 50 + 40 * Math.cos(startRad)
              const y1 = 50 + 40 * Math.sin(startRad)
              const x2 = 50 + 40 * Math.cos(endRad)
              const y2 = 50 + 40 * Math.sin(endRad)

              // Determine if the arc should take the long path (> 180 degrees)
              const largeArcFlag = slice.endAngle - slice.startAngle > 180 ? 1 : 0

              const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`

              return (
                <motion.path
                  key={index}
                  d={pathData}
                  fill={slice.color}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="drop-shadow-md hover:brightness-110 transition-all cursor-pointer"
                />
              )
            })}
            <circle cx="50" cy="50" r="25" fill="hsl(var(--card))" className="drop-shadow-inner" />
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

        <div className="flex justify-center mt-6 space-x-6">
          {pieData.map((item, index) => (
            <motion.div
              key={index}
              className="flex items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
            >
              <div className="w-4 h-4 mr-2 rounded-sm" style={{ backgroundColor: item.color }}></div>
              <div>
                <div className="text-sm font-medium">{item.name}</div>
                <div className="text-xs text-muted-foreground">
                  {item.value} ({Math.round((item.value / total) * 100)}%)
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  // Create enhanced bar chart renderer
  const renderEnhancedBarChart = () => (
    <div className="h-full w-full flex flex-col">
      <div className="flex-1 flex items-end justify-around pt-6">
        {barData.map((entry, index) => (
          <div key={index} className="flex flex-col items-center group">
            <div className="mb-2 text-xs font-medium opacity-70 group-hover:opacity-100 transition-opacity">
              {entry.name}
            </div>
            <div className="flex space-x-4">
              <div className="flex flex-col items-center">
                <motion.div
                  className="relative flex flex-col items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <motion.div
                    className="w-12 rounded-t-md bg-gradient-to-t from-primary to-primary/40 shadow-lg hover:shadow-primary/20 transition-all"
                    style={{ height: `${(entry.actors / maxActorCount) * maxBarHeight}px` }}
                    initial={{ height: 0 }}
                    animate={{ height: `${(entry.actors / maxActorCount) * maxBarHeight}px` }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  >
                    <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {entry.actors}
                    </div>
                  </motion.div>
                </motion.div>
                <div className="text-xs mt-2 text-primary/80">Actors</div>
              </div>

              <div className="flex flex-col items-center">
                <motion.div
                  className="relative flex flex-col items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.15 }}
                >
                  <motion.div
                    className="w-12 rounded-t-md bg-gradient-to-t from-primary/60 to-primary/20 shadow-lg hover:shadow-primary/10 transition-all"
                    style={{ height: `${(entry.useCases / maxUseCaseCount) * maxBarHeight}px` }}
                    initial={{ height: 0 }}
                    animate={{ height: `${(entry.useCases / maxUseCaseCount) * maxBarHeight}px` }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 + 0.15 }}
                  >
                    <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-primary/60 text-primary-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {entry.useCases}
                    </div>
                  </motion.div>
                </motion.div>
                <div className="text-xs mt-2 text-primary/60">Use Cases</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="h-px w-full bg-border mt-2"></div>
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
            <CardContent className="h-[350px]">{renderEnhancedPieChart()}</CardContent>
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
            <CardContent className="h-[350px]">{renderEnhancedBarChart()}</CardContent>
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
