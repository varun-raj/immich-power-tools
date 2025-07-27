import React, { useEffect, useMemo, useState } from 'react'
import { IAlbum } from '@/types/album'
import { getAlbumPeople } from '@/handlers/api/album.handler'
import Loader from '@/components/ui/loader'
import LazyImage from '@/components/ui/lazy-image'
import { PERSON_THUBNAIL_PATH } from '@/config/routes'
import Link from 'next/link'
import { useConfig } from '@/contexts/ConfigContext'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { PersonMergeDropdown } from '@/components/people/PersonMergeDropdown'
import { Button } from '@/components/ui/button'
import { updatePerson } from '@/handlers/api/people.handler'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'

interface AlbumPeopleProps {
  album: IAlbum
  onSelect: (personId: string) => void
  readOnly?: boolean
}

interface IAlbumPerson {
  id: string
  name: string
  numberOfPhotos: number
  
}
export default function AlbumPeople({ album, onSelect, readOnly }: AlbumPeopleProps) {
  const { exImmichUrl } = useConfig()
  const router = useRouter()
  const { query, pathname } = router
  const [people, setPeople] = useState<IAlbumPerson[]>([])
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [hidingPerson, setHidingPerson] = useState<boolean>(false)
  const [selectionMode, setSelectionMode] = useState<boolean>(false)
  const [selectedPeople, setSelectedPeople] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")

  const selectedPerson = useMemo(() => {
    return people.find((person) => query.faceId === person.id)
  }, [people, query.faceId])

  const filteredPeople = useMemo(() => {
    return people.filter((person) => person.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [people, searchQuery])

  const { knownPeople, unknownPeople } = useMemo(() => {
    return {
      knownPeople: people.filter((person) => person.name),
      unknownPeople: people.filter((person) => !person.name)
    }
  }, [people])

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

  const renderPerson = (person: IAlbumPerson) => (
    <div
      className={cn(
        'flex items-center gap-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700 rounded-md p-1',
        selectedPerson?.id === person.id ? "bg-gray-300 dark:bg-gray-700" : ""
      )}
      key={person.id}
      onClick={() => {
        if (selectionMode) {
          handleBulkSelect(person.id)
        } else {
          onSelect(person.id)
        }
      }}
    >
      {selectionMode && (
        <Checkbox
          id={person.id + "_checkbox"}
          checked={selectedPeople.includes(person.id)}
          onCheckedChange={() => handleBulkSelect(person.id)}
        />
      )}
      <LazyImage
        role="button"
        className={
          cn("cursor-pointer h-8 w-8 min-w-8 rounded-full",
          )
        }
        src={PERSON_THUBNAIL_PATH(person.id)} alt={person.name} />
      <div className='flex flex-col'>
        <p className='text-sm'>{person.name || "No Name"}</p>
        <p className={
          cn("text-xs text-gray-500 dark:text-gray-400")
        }>{person.numberOfPhotos} photos</p>
      </div>
    </div>
  )

  return (
    <div className="overflow-y-auto min-w-[200px] sticky top-0 py-2 max-h-[calc(100vh-60px)] min-h-[calc(100vh-60px)] border-r border-gray-200 dark:border-zinc-800 flex flex-col gap-2 px-2">
      <Input
        placeholder="Search"
        className="w-full"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {selectedPerson && (
        <div className='flex flex-col gap-2 bg-white dark:bg-zinc-900 py-2 rounded-md'>
          <div className='flex items-center gap-2'>
            <Image
              src={PERSON_THUBNAIL_PATH(selectedPerson.id)}
              alt={selectedPerson.name}
              width={20}
              height={20}
              className="rounded-full"
            />

            <Link target="_blank" href={`${exImmichUrl}/people/${selectedPerson.id}`}
              className="text-sm font-medium">
              {selectedPerson.name || "No Name"}
            </Link>
          </div>
          {!readOnly && (
            <div className='flex items-center gap-2'>
              <PersonMergeDropdown
                person={{
                  ...selectedPerson,
                  assetCount: selectedPerson.numberOfPhotos,
                  birthDate: null,
                  thumbnailPath: PERSON_THUBNAIL_PATH(selectedPerson.id),
                  isHidden: false,
                  updatedAt: new Date()
                }}
                triggerClassName='w-full flex-1'
                onComplete={(mergedPerson) => {
                  router.push({
                    pathname,
                    query: {
                      ...query,
                      faceId: mergedPerson.id
                    }
                  })
                }} />
              <Button disabled={hidingPerson} className="!py-0.5 !px-2 text-xs h-7 flex-1" variant="outline" onClick={() => handleHidePerson(selectedPerson.id)}>
                Hide
              </Button>
            </div>
          )}
        </div>
      )}

      <div className='flex flex-col gap-1 flex-1 overflow-y-auto'>

      <div className="flex items-center gap-2 justify-between">
        <p className="text-sm font-medium">Known People</p>
        {!readOnly && (
          <>
            {!selectedPerson && (
              <Button variant="outline" className="!py-0.5 !px-2 text-xs h-7" onClick={() => {
                setSelectionMode(!selectionMode)
                setSelectedPeople([])
              }}>
                {selectionMode ? "Cancel" : "Select"}
              </Button>
            )}
            {selectedPeople.length > 0 && (
              <div className='absolute mx-auto bottom-0 w-full py-2 bg-white darl:bg-black -mx-2 px-2'>
                <Button variant="outline" className="!py-0.5 !px-2 text-xs h-7" onClick={handleHideSelectedPeople}>
                  Hide {selectedPeople.length} people
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      <div className="flex flex-col gap-1">
        {knownPeople.map(renderPerson)}
      </div>
      {unknownPeople.length > 0 && (
        <div className='flex flex-col gap-1'>
          <p className='text-sm font-medium'>Unknown People</p>
          {unknownPeople.map(renderPerson)}
        </div>
      )}
      </div>
    </div>
  )
}
