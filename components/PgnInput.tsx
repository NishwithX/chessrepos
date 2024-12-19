import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface PgnInputProps {
  addPgn: (name: string, pgn: string) => void
}

const PgnInput: React.FC<PgnInputProps> = ({ addPgn }) => {
  const [pgn, setPgn] = useState('')
  const [name, setName] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSubmit = () => {
    if (pgn && name) {
      addPgn(name, pgn)
      setPgn('')
      setName('')
      setIsDialogOpen(false)
    }
  }

  return (
    <div className="mb-4">
      <Textarea
        placeholder="Paste your PGN here"
        value={pgn}
        onChange={(e) => setPgn(e.target.value)}
        className="mb-2 h-24"
      />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button disabled={!pgn} className="w-full">Submit PGN</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Name your PGN</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Enter a name for this PGN"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button onClick={handleSubmit} className="w-full">Save PGN</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PgnInput

