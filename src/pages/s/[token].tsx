import PageLayout from '@/components/layouts/PageLayout'
import Header from '@/components/shared/Header'
import Loader from '@/components/ui/loader'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Camera } from 'lucide-react'
import { humanizeNumber } from '@/helpers/string.helper'
import { getShareLinkAssets, getShareLinkInfo, getShareLinkPeople } from '@/handlers/api/shareLink.handler'
import AssetGrid from '@/components/shared/AssetGrid'
import { IAsset } from '@/types/asset'
import { IPerson } from '@/types/person'
import PeopleList from '@/components/shared/PeopleList'
import { ShareLinkFilters } from '@/types/shareLink'
import clsx from 'clsx'
import { LinkBreak2Icon } from '@radix-ui/react-icons'

export default function AlbumListPage() {
  const router = useRouter()
  const { pathname, query } = router
  const { token, personIds } = query as { token: string, personIds: string[] }
  const [assets, setAssets] = useState<IAsset[]>([])
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [people, setPeople] = useState<IPerson[]>([])
  const [peopleLoading, setPeopleLoading] = useState(false)
  const [config, setConfig] = useState<ShareLinkFilters>({})
  const [filters, setFilters] = useState<ShareLinkFilters | null>(null)


  const handleSelectPerson = (person: IPerson) => {
    const personIds = query.personIds as string[]
    let currentPersonIds = personIds
    if (!personIds) {
      currentPersonIds = []
    } else {
      currentPersonIds = Array.isArray(personIds) ? personIds : [personIds]
    }
    const isPersonSelected = currentPersonIds.includes(person.id);
    const newPersonIds = isPersonSelected ? currentPersonIds.filter((id) => id !== person.id) : [...currentPersonIds, person.id];

    router.push({
      pathname: pathname,
      query: {
        ...query,
        personIds: newPersonIds
      }
    })
    setFilters({
      personIds: newPersonIds
    })
  }

  const fetchAssets = async () => {
    if (!filters) return
    setLoading(true)
    getShareLinkAssets(token, filters)
      .then(({ assets }) => {
        setAssets(assets)
      })
      .catch((error) => {
        setErrorMessage(error.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const fetchAlbumInfo = async () => {
    setLoading(true)
    getShareLinkInfo(token)
      .then((conf) => {
        setConfig(conf)
        if (conf.p) {
          fetchPeople()
        }
        setFilters({
          personIds: query.personIds as string[]
        })
      })
      .catch((error) => {
        setErrorMessage(error.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const fetchPeople = async () => {
    setPeopleLoading(true)
    getShareLinkPeople(token)
      .then(setPeople)
      .catch((error) => {
        setErrorMessage(error.message)
      })
      .finally(() => {
        setPeopleLoading(false)
      })
  }

  useEffect(() => {
    fetchAlbumInfo()
  }, [])

  useEffect(() => {
    if (!filters) return
    fetchAssets()
  }, [filters])

  const renderContent = () => {
    if (loading) return <Loader />
    else if (errorMessage) return <div className="flex flex-col gap-4 items-center justify-center h-full">
      <LinkBreak2Icon className="w-10 h-10 text-zinc-500" />
      <p className="text-zinc-500">{errorMessage}</p>
    </div>
    return (
      <div className="flex gap-1 max-h-full">
        {config.p && (
          <div className="w-1/6 overflow-y-auto sticky top-0">
            {peopleLoading ? <Loader /> : <PeopleList
              people={people}
              onSelect={handleSelectPerson}
              selectedIds={query.personIds as string[]}
            />
            }
          </div>
        )}
        <div className={clsx("overflow-y-auto sticky top-0", config.p ? "w-5/6" : "w-full")}>
          {loading ? <Loader /> : <AssetGrid
            assets={assets}
            isInternal={false}
          />}
        </div>
      </div>
    )
  }
  return (
    <PageLayout className="!p-0 !mb-0">
      <Header
        leftComponent={"Shared Link"}
        rightComponent={
          !loading && (
            <div className="flex items-center gap-2">
              <p className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-500">
                {humanizeNumber(assets.length || 0)}
                <Camera className="w-4 h-4" />
              </p>
            </div>
          )
        }
      />
      {renderContent()}
    </PageLayout>
  )
}
