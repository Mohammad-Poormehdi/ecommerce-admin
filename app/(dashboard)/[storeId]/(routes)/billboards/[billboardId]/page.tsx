import prismadb from "@/lib/prismadb"

import BillboardForm from "../components/billboard-form"

interface BillboardPageProps {
  params: {
    storeId: string
    billboardId: string
  }
}

const BillboardPage: React.FC<BillboardPageProps> = async ({ params }) => {
  const billboard = await prismadb.billboard.findUnique({
    where: { id: params.billboardId },
  })
  return (
    <>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <BillboardForm billboard={billboard} params={params} />
        </div>
      </div>
    </>
  )
}

export default BillboardPage
