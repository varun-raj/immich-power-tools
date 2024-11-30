import React, { useEffect, useMemo, useState } from 'react'
import { IAlbum } from '@/types/album'
import { IPerson } from '@/types/person'
import { getAlbumPeople } from '@/handlers/api/album.handler'
import Loader from '@/components/ui/loader'
import LazyImage from '@/components/ui/lazy-image'
import { PERSON_THUBNAIL_PATH } from '@/config/routes'
import Link from 'next/link'
import { useConfig } from '@/contexts/ConfigContext'
import { Tooltip } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Users, X } from 'lucide-react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { PersonMergeDropdown } from '@/components/people/PersonMergeDropdown'
import { Button } from '@/components/ui/button'
import { updatePerson } from '@/handlers/api/people.handler'

interface AlbumPeopleProps {
  album: IAlbum
  onSelect: (personId: string) => void
}

interface IAlbumPerson {
  id: string
  name: string
  numberOfPhotos: number
}
export default function AlbumPeople({ album, onSelect }: AlbumPeopleProps) {
  const { exImmichUrl } = useConfig()
  const router = useRouter()
  const { query, pathname } = router
  const [people, setPeople] = useState<IAlbumPerson[]>([])
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [hidingPerson, setHidingPerson] = useState<boolean>(false)
  const [selectionMode, setSelectionMode] = useState<boolean>(false)
  const [selectedPeople, setSelectedPeople] = useState<string[]>([])

  const selectedPerson = useMemo(() => {
    return people.find((person) => query.faceId === person.id)
  }, [people, query.faceId])

  const fetchPeople = async () => {
    return getAlbumPeople(album.id).then((people) => {
      setPeople(people)
    }).catch((error) => {
      setErrorMessage(error.message)
    }).finally(() => {
      setLoading(false)
    })
  }

  const handleHidePerson = (personId: string) => {
    setHidingPerson(true)
    updatePerson(personId, { isHidden: true }).then(() => {
      setPeople((oldPeople) => oldPeople.filter((person) => person.id !== personId))
      router.push({
        pathname,
        query: {
          ...query,
          faceId: null
        }
      })
    }).finally(() => {
      setHidingPerson(false)
    })
  }

  const handleHideSelectedPeople = () => {
    const promises = selectedPeople.map((personId) => {
      return handleHidePerson(personId)
    })
    Promise.all(promises).then(() => {
      setSelectedPeople([])
      setSelectionMode(false)
    })
  }

  const handleBulkSelect = (personId: string) => {
    if (selectedPeople.includes(personId)) {
      setSelectedPeople(selectedPeople.filter((id) => id !== personId))
    } else {
      setSelectedPeople([...selectedPeople, personId])
    }
  }

  useEffect(() => {
    fetchPeople()
  }, [])

  if (loading) {
    return <Loader />
  }
  if (errorMessage) {
    return <div>{errorMessage}</div>
  }

  return (
    <Accordion type="multiple">
      <AccordionItem value="people">
        <div className='flex justify-between gap-2 w-full sticky top-0 z-10 bg-white dark:bg-black'>
          <AccordionTrigger noIcon>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <p className="text-sm font-medium">People</p>
            </div>
          </AccordionTrigger>
          <div className="flex items-center gap-2">
            {selectedPerson ? (
              <>
                <Tooltip content={"Open in Immich"} delayDuration={0}>
                  <div className="flex items-center gap-2">
                    <div>
                      <Image
                        src={PERSON_THUBNAIL_PATH(selectedPerson.id)}
                        alt={selectedPerson.name}
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                    </div>
                    <Link target="_blank" href={`${exImmichUrl}/people/${selectedPerson.id}`} className="text-sm font-medium">{selectedPerson.name}</Link>
                  </div>
                </Tooltip>
                <PersonMergeDropdown person={{
                  ...selectedPerson,
                  assetCount: selectedPerson.numberOfPhotos,
                  birthDate: null,
                  thumbnailPath: PERSON_THUBNAIL_PATH(selectedPerson.id),
                  isHidden: false,
                  updatedAt: new Date()
                }} onComplete={(mergedPerson) => {
                  router.push({
                    pathname,
                    query: {
                      ...query,
                      faceId: mergedPerson.id
                    }
                  })
                }} />
                <div>
                  <Button disabled={hidingPerson} className="!py-0.5 !px-2 text-xs h-7" variant="outline" onClick={() => handleHidePerson(selectedPerson.id)}>
                    Hide
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                {selectedPeople.length > 0 && (
                  <>
                    <p className="text-sm font-medium">{selectedPeople.length} people selected</p>
                    <Button variant="outline" size="sm" onClick={handleHideSelectedPeople}>
                      Hide
                    </Button>
                  </>
                )}
                <Button variant="outline" size="sm" onClick={() => setSelectionMode(!selectionMode)}>  
                  {selectionMode ? "Cancel" : "Select People"}
                </Button>
              </div>
            )}
            <AccordionTrigger className="flex items-center justify-between gap-2 w-full" />
          </div>
        </div>
        <AccordionContent className="flex items-center flex-wrap overflow-x-hidden gap-1">
          {people.map((person) => (
            <Tooltip key={person.id} delayDuration={0} content={(person.name || "No Name")}>
              <div className='relative'>
                <LazyImage
                  onClick={() => {
                    if (selectionMode) {
                      handleBulkSelect(person.id)
                    } else {
                      onSelect(person.id)
                    }
                  }}
                  role="button"
                  className={
                    cn("cursor-pointer h-16 w-16 min-w-16  rounded border-2",
                      !!person.name ? "border-blue-500" : "border-gray-500",
                      selectedPerson?.id === person.id ? "border-green-500" : "",
                      selectionMode ? "border-blue-500" : "",
                      selectedPeople.includes(person.id) ? "border-green-500" : ""
                    )
                  }
                  src={PERSON_THUBNAIL_PATH(person.id)} alt={person.name} />
                <p className={
                  cn("text-xs text-black absolute top-0 right-0 left-0 text-center bg-white/50",
                    selectedPerson?.id === person.id ? "bg-green-500" : ""
                  )
                }>{person.numberOfPhotos}</p>
              </div>
            </Tooltip>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
