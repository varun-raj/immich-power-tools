
import { useRouter } from "next/router"
import { useMemo } from "react"
import { Button } from "../ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"

export function PeoplePagination() {
  const router = useRouter()
  const { pathname } = router;
  const { page = 1 } = router.query as { page: string }

  const [nextPage, prevPage] = useMemo(() => {
    const pageNum = parseInt(page.toString() || "1", 10)
    return [pageNum + 1, pageNum - 1]

  }, [page])

  return (
    <div className="flex gap-2">
      <Link href={{
        pathname,
        query: { page: prevPage }
      }}>
      <Button 
        className="w-[150px]"
        disabled={prevPage < 1}
      >
        <ArrowLeft className="mr-2" size={16} />
        Previous Page 
        </Button>
        </Link>
      
      <Link href={{
        pathname,
        query: { page: nextPage }
      }}>
      <Button 
      className="w-[150px]"
      >
        Next Page
        <ArrowRight className="ml-2" size={16} />
      </Button>
      </Link>
    </div>
  )
}
