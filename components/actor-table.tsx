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
import type { Actor, ActorComplexity } from "@/lib/types"

interface ActorTableProps {
  actors: Actor[]
  setActors: React.Dispatch<React.SetStateAction<Actor[]>>
  readOnly?: boolean
}

export function ActorTable({ actors, setActors, readOnly = false }: ActorTableProps) {
  const [newActor, setNewActor] = useState<string>("")

  const handleComplexityChange = (index: number, complexity: ActorComplexity) => {
    const updatedActors = [...actors]
    updatedActors[index].complexity = complexity
    setActors(updatedActors)
  }

  const handleAddActor = () => {
    if (newActor.trim()) {
      setActors([...actors, { name: newActor.trim(), complexity: "simple" }])
      setNewActor("")
    }
  }

  const handleRemoveActor = (index: number) => {
    const updatedActors = [...actors]
    updatedActors.splice(index, 1)
    setActors(updatedActors)
  }

  return (
    <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center">
          <span className="bg-primary w-2 h-6 rounded-sm mr-2"></span>
          Actors
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
                <p className="font-medium">Actor Complexity Classification:</p>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium text-primary/70">Simple (weight 1):</span> External systems with
                    well-defined API interfaces
                  </p>
                  <p>
                    <span className="font-medium text-primary/80">Average (weight 2):</span> External systems using
                    protocols or humans using text interfaces
                  </p>
                  <p>
                    <span className="font-medium text-primary">Complex (weight 3):</span> Humans using graphical user
                    interfaces
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
              <TableHead className="w-[60%]">Actor Name</TableHead>
              <TableHead className="w-[30%]">Complexity</TableHead>
              {!readOnly && <TableHead className="w-[10%]">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {actors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={readOnly ? 2 : 3} className="text-center text-muted-foreground py-8">
                    No actors detected in the diagram.
                  </TableCell>
                </TableRow>
              ) : (
                actors.map((actor, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="border-b border-border/50 hover:bg-muted/30"
                  >
                    <TableCell className="font-medium">{actor.name}</TableCell>
                    <TableCell>
                      <Select
                        value={actor.complexity}
                        onValueChange={(value: ActorComplexity) => handleComplexityChange(index, value)}
                        disabled={readOnly}
                      >
                        <SelectTrigger
                          className={`w-full ${
                            actor.complexity === "simple"
                              ? "text-primary/70"
                              : actor.complexity === "average"
                                ? "text-primary/80"
                                : "text-primary"
                          }`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="simple" className="text-primary/70">
                            Simple (1)
                          </SelectItem>
                          <SelectItem value="average" className="text-primary/80">
                            Average (2)
                          </SelectItem>
                          <SelectItem value="complex" className="text-primary">
                            Complex (3)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    {!readOnly && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveActor(index)}
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
            placeholder="Add new actor..."
            value={newActor}
            onChange={(e) => setNewActor(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddActor()
            }}
            className="border-primary/30 focus-visible:ring-primary/20"
          />
          <Button onClick={handleAddActor} className="bg-primary hover:bg-primary/90 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Actor
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}
