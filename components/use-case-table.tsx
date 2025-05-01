"use client"

import type React from "react"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion, AnimatePresence } from "framer-motion"
import type { UseCase, UseCaseComplexity } from "@/lib/types"

interface UseCaseTableProps {
  useCases: UseCase[]
  setUseCases: React.Dispatch<React.SetStateAction<UseCase[]>>
  readOnly?: boolean
}

export function UseCaseTable({ useCases, setUseCases, readOnly = false }: UseCaseTableProps) {
  const [newUseCase, setNewUseCase] = useState<string>("")

  const handleComplexityChange = (index: number, complexity: UseCaseComplexity) => {
    const updatedUseCases = [...useCases]
    updatedUseCases[index].complexity = complexity
    setUseCases(updatedUseCases)
  }

  const handleAddUseCase = () => {
    if (newUseCase.trim()) {
      setUseCases([...useCases, { name: newUseCase.trim(), complexity: "simple" }])
      setNewUseCase("")
    }
  }

  const handleRemoveUseCase = (index: number) => {
    const updatedUseCases = [...useCases]
    updatedUseCases.splice(index, 1)
    setUseCases(updatedUseCases)
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center">
          <span className="bg-primary/60 w-2 h-6 rounded-sm mr-2"></span>
          Use Cases
        </h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm p-4 bg-card border-border shadow-lg">
              <div className="space-y-2">
                <p className="font-medium">Use Case Complexity Classification:</p>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium text-primary/70">Simple (weight 5):</span> 1-3 transactions, simple
                    implementation
                  </p>
                  <p>
                    <span className="font-medium text-primary/80">Average (weight 10):</span> 4-7 transactions, moderate
                    complexity
                  </p>
                  <p>
                    <span className="font-medium text-primary">Complex (weight 15):</span> More than 7 transactions or
                    complex business logic
                  </p>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="rounded-md border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[60%]">Use Case Name</TableHead>
              <TableHead className="w-[30%]">Complexity</TableHead>
              {!readOnly && <TableHead className="w-[10%]">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {useCases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={readOnly ? 2 : 3} className="text-center text-muted-foreground py-8">
                    No use cases detected in the diagram.
                  </TableCell>
                </TableRow>
              ) : (
                useCases.map((useCase, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="border-b border-border/50 hover:bg-muted/30"
                  >
                    <TableCell className="font-medium">{useCase.name}</TableCell>
                    <TableCell>
                      <Select
                        value={useCase.complexity}
                        onValueChange={(value: UseCaseComplexity) => handleComplexityChange(index, value)}
                        disabled={readOnly}
                      >
                        <SelectTrigger
                          className={`w-full ${
                            useCase.complexity === "simple"
                              ? "text-primary/70"
                              : useCase.complexity === "average"
                                ? "text-primary/80"
                                : "text-primary"
                          }`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="simple" className="text-primary/70">
                            Simple (5)
                          </SelectItem>
                          <SelectItem value="average" className="text-primary/80">
                            Average (10)
                          </SelectItem>
                          <SelectItem value="complex" className="text-primary">
                            Complex (15)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    {!readOnly && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveUseCase(index)}
                          className="hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      {!readOnly && (
        <motion.div
          className="flex space-x-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Input
            placeholder="Add new use case..."
            value={newUseCase}
            onChange={(e) => setNewUseCase(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddUseCase()
            }}
            className="border-primary/30 focus-visible:ring-primary/20"
          />
          <Button onClick={handleAddUseCase} className="bg-primary hover:bg-primary/90 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Use Case
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}
