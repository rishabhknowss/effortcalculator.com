import { Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="mt-16 py-6 border-t border-border/40">
      <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-muted-foreground">Built with ❤️ by Rishabh & Shashank</p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/yourusername/uml-effort-calculator"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="GitHub Repository"
          >
            <Github className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  )
}
