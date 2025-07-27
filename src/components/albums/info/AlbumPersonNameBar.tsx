import FloatingBar from '@/components/shared/FloatingBar'
import { AlertDialog, IAlertDialogActions } from '@/components/ui/alert-dialog'
import { Autocomplete, AutocompleteOption } from '@/components/ui/autocomplete'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { mergePerson, searchPeople, updatePerson } from '@/handlers/api/people.handler'
import { IAlbumPerson } from '@/types/album'
import { useRef, useState } from 'react'
import { Toaster } from 'react-hot-toast'

interface AlbumPersonNameBarProps {
  selectedPerson: IAlbumPerson | null
  faceId: string
  onUpdate: (person: IAlbumPerson | null) => void
  onMerge: (oldPerson: IAlbumPerson, newPerson: IAlbumPerson) => void
}

export default function AlbumPersonNameBar({ selectedPerson, faceId, onUpdate, onMerge }: AlbumPersonNameBarProps) {

  const [newName, setNewName] = useState(selectedPerson?.name)
  const [loading, setLoading] = useState(false)
  const mergeDialogRef = useRef<IAlertDialogActions>(null);
  const selectedPersonRef = useRef<AutocompleteOption | null>(null);

  const { toast } = useToast()


  const handleFormSubmit = () => {
    if (!faceId) return
    setLoading(true)
    updatePerson(faceId, {
      name: newName
    })
      .then((person) => {
        onUpdate(person)
      })
      .catch((error) => {
        toast({
          title: "Error updating person",
          description: error.message,
          variant: "destructive"
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleMerge = async (option: AutocompleteOption) => {
    if (!selectedPerson) return
    return mergePerson(option.value, [selectedPerson.id]).then(() => {
      onMerge(selectedPerson, {
        ...selectedPerson,
        id: option.value,
        name: option.label,
      })
    })
      .catch((error) => {
        toast({
          title: "Error merging person",
          description: error.message,
          variant: "destructive"
        })
      })
      .finally(() => {
        setLoading(false)
      })
  };

  return (
    <>
      <FloatingBar>
        <div className="flex items-center gap-2 justify-between w-full">
          <Autocomplete
            position="bottom"
            loadOptions={(query: string) => searchPeople(query).then((people) => people.map((person: any) => ({
              label: person.name, value: person.id,
              imageUrl: person.thumbnailPath
            })))}
            type="text"
            defaultValue={newName}
            placeholder="Enter name"
            autoFocus
            onChange={(e) => {
              setNewName(e.target.value);
            }}
            value={newName || ""}
            onOptionSelect={(value) => {
              mergeDialogRef.current?.open();
              selectedPersonRef.current = value;
            }}
            createNewLabel="Create"
            disabled={loading}
            onCreateNew={() => {
              console.log("create new")
              handleFormSubmit();
            }}
          />
        </div>
      </FloatingBar>
      <AlertDialog
        ref={mergeDialogRef}
        title="Merge Person"
        description="Are you sure you want to merge this person with the selected person?"
        onConfirm={() => {
          if (selectedPersonRef.current) {
            handleMerge(selectedPersonRef.current);
          }
        }}
      />
    </>
  )
}